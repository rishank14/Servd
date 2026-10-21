"use server";

import { revalidatePath } from "next/cache";
import { request } from "@arcjet/next";
import { and, desc, eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/db";
import { pantryItem } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { pantryScans } from "@/lib/arcjet";

type Ingredient = {
   name: string;
   quantity: string;
   confidence?: number;
};

function getPublicErrorMessage(error: unknown, fallback: string) {
   if (error instanceof Error) {
      // Only expose expected validation/auth/rate-limit messages.
      const safeMessages = new Set([
         "You must be signed in to manage your pantry.",
         "Please choose an image to scan.",
         "The uploaded file must be an image.",
         "Please upload an image smaller than 10 MB.",
         "Gemini is not configured. Please contact support.",
         "Couldn't read the detected ingredients. Please try another photo.",
         "No ingredients were detected. Please try a clearer photo.",
         "No ingredients detected. Please try a clearer photo.",
         "Bot activity detected. Access denied.",
         "Pantry scanning is temporarily unavailable. Please try again later.",
         "No ingredients were provided to save.",
         "The ingredient data is invalid. Please scan the image again.",
         "Select at least one ingredient to save.",
         "No valid ingredients were provided to save.",
         "Ingredient name is required.",
         "A pantry item ID is required.",
         "Pantry item not found or you don't have permission to delete it.",
         "Pantry item not found or you don't have permission to update it.",
      ]);
      if (safeMessages.has(error.message)) return error.message;
   }
   return fallback;
}

async function requireUser() {
   const user = await getCurrentUser();

   if (!user) {
      throw new Error("You must be signed in to manage your pantry.");
   }

   return user;
}

function readString(formData: FormData, key: string) {
   const value = formData.get(key);
   return typeof value === "string" ? value.trim() : "";
}

/**
 * Scan a pantry/fridge photo with Gemini.
 * Unlimited scans with Arcjet bot and shield protection.
 * Requires GEMINI_API_KEY in the server environment.
 */
export async function scanPantryImage(formData: FormData) {
   try {
      await requireUser();

      // Arcjet's request() helper supplies the request metadata needed by its rules.
      const req = await request();
      const decision = await pantryScans.protect(req);

      if (decision.isDenied()) {
         console.warn("Arcjet denied a pantry image scan:", decision.reason);
         if (decision.reason.isBot()) {
            throw new Error("Bot activity detected. Access denied.");
         }
         throw new Error(
            "Pantry scanning is temporarily unavailable. Please try again later.",
         );
      }

      const imageFile = formData.get("image");

      if (!(imageFile instanceof File) || imageFile.size === 0) {
         throw new Error("Please choose an image to scan.");
      }

      if (!imageFile.type.startsWith("image/")) {
         throw new Error("The uploaded file must be an image.");
      }

      const maxImageSize = 10 * 1024 * 1024;
      if (imageFile.size > maxImageSize) {
         throw new Error("Please upload an image smaller than 10 MB.");
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
         console.error("GEMINI_API_KEY is not configured.");
         throw new Error("Gemini is not configured. Please contact support.");
      }

      const base64Image = Buffer.from(await imageFile.arrayBuffer()).toString(
         "base64",
      );
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
         model: "gemini-3.5-flash-lite",
         generationConfig: { responseMimeType: "application/json" },
      });

      const prompt = `
You are a professional chef and ingredient-recognition expert. Identify visible food ingredients in this pantry or refrigerator image.

Return only a valid JSON array, with no Markdown or explanation, using this structure:
[
  {
    "name": "ingredient name",
    "quantity": "estimated quantity with unit",
    "confidence": 0.95
  }
]

Rules:
- Identify food ingredients only, not containers, utensils, or packaging.
- Use specific ingredient names when possible.
- Estimate a realistic quantity when possible; otherwise use "Unknown quantity".
- Include only items with confidence of at least 0.7.
- Return at most 20 items.
- Do not invent ingredients that are not visibly supported by the image.
`;

      const result = await model.generateContent([
         prompt,
         {
            inlineData: {
               mimeType: imageFile.type,
               data: base64Image,
            },
         },
      ]);

      const responseText = result.response.text();
      const cleanText = responseText
         .replace(/^```(?:json)?\s*/i, "")
         .replace(/\s*```$/, "")
         .trim();

      let parsed: unknown;
      try {
         try {
            parsed = JSON.parse(cleanText);
         } catch {
            const arrayMatch = responseText.match(/\[[\s\S]*\]/);
            if (!arrayMatch) throw new Error("No JSON array found");
            parsed = JSON.parse(arrayMatch[0]);
         }
      } catch {
         console.error("Gemini returned invalid ingredient JSON:", responseText);
         throw new Error(
            "Couldn't read the detected ingredients. Please try another photo.",
         );
      }

      if (!Array.isArray(parsed)) {
         throw new Error(
            "No ingredients were detected. Please try a clearer photo.",
         );
      }

      const ingredients: Ingredient[] = parsed
         .filter(
            (item): item is Record<string, unknown> =>
               typeof item === "object" && item !== null,
         )
         .filter(
            (item) =>
               typeof item.name === "string" &&
               item.name.trim().length > 0 &&
               (typeof item.confidence !== "number" || item.confidence >= 0.7),
         )
         .slice(0, 20)
         .map((item) => ({
            name: String(item.name).trim().slice(0, 120),
            quantity:
               typeof item.quantity === "string" && item.quantity.trim()
                  ? item.quantity.trim().slice(0, 120)
                  : "Unknown quantity",
            ...(typeof item.confidence === "number"
               ? { confidence: item.confidence }
               : {}),
         }));

      if (ingredients.length === 0) {
         throw new Error("No ingredients detected. Please try a clearer photo.");
      }

      return {
         success: true as const,
         ingredients,
         message: `Found ${ingredients.length} possible ingredients.`,
      };
   } catch (error) {
      console.error("Error scanning pantry image:", error);
      throw new Error(getPublicErrorMessage(error, "Failed to scan the image."));
   }
}

/** Save ingredients returned by scanPantryImage. Expects an "ingredients" JSON string. */
export async function saveToPantry(formData: FormData) {
   try {
      const user = await requireUser();
      const ingredientsValue = formData.get("ingredients");

      if (typeof ingredientsValue !== "string" || !ingredientsValue.trim()) {
         throw new Error("No ingredients were provided to save.");
      }

      let parsed: unknown;
      try {
         parsed = JSON.parse(ingredientsValue);
      } catch {
         throw new Error(
            "The ingredient data is invalid. Please scan the image again.",
         );
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
         throw new Error("Select at least one ingredient to save.");
      }

      const ingredients = parsed
         .filter(
            (item): item is Record<string, unknown> =>
               typeof item === "object" && item !== null,
         )
         .filter(
            (item) =>
               typeof item.name === "string" && item.name.trim().length > 0,
         )
         .slice(0, 20)
         .map((item) => ({
            name: String(item.name).trim().slice(0, 120),
            quantity:
               typeof item.quantity === "string" && item.quantity.trim()
                  ? item.quantity.trim().slice(0, 120)
                  : null,
            ownerId: user.id,
         }));

      if (ingredients.length === 0) {
         throw new Error("No valid ingredients were provided to save.");
      }

      const savedItems = await db
         .insert(pantryItem)
         .values(ingredients)
         .returning();

      revalidatePath("/pantry");

      return {
         success: true as const,
         savedItems,
         message: `Saved ${savedItems.length} ${savedItems.length === 1 ? "item" : "items"
            } to your pantry.`,
      };
   } catch (error) {
      console.error("Error saving scanned ingredients:", error);
      throw new Error(
         getPublicErrorMessage(error, "Failed to save ingredients."),
      );
   }
}

/** Add one pantry item manually from FormData containing name and quantity. */
export async function addPantryItemManually(formData: FormData) {
   try {
      const user = await requireUser();
      const name = readString(formData, "name");
      const quantity = readString(formData, "quantity");

      if (!name) throw new Error("Ingredient name is required.");

      const [item] = await db
         .insert(pantryItem)
         .values({
            name: name.slice(0, 120),
            quantity: quantity ? quantity.slice(0, 120) : null,
            ownerId: user.id,
         })
         .returning();

      revalidatePath("/pantry");

      return {
         success: true as const,
         item,
         message: "Ingredient added to your pantry.",
      };
   } catch (error) {
      console.error("Error adding pantry item:", error);
      throw new Error(
         getPublicErrorMessage(error, "Failed to add the ingredient."),
      );
   }
}

/** Fetch only the signed-in user's pantry items, newest first. */
export async function getPantryItems() {
   try {
      const user = await requireUser();
      const items = await db
         .select()
         .from(pantryItem)
         .where(eq(pantryItem.ownerId, user.id))
         .orderBy(desc(pantryItem.createdAt));

      return { success: true as const, items };
   } catch (error) {
      console.error("Error fetching pantry items:", error);
      throw new Error(
         getPublicErrorMessage(error, "Failed to load your pantry."),
      );
   }
}

/** Delete an item only if it belongs to the signed-in user. */
export async function deletePantryItem(formData: FormData) {
   try {
      const user = await requireUser();
      const itemId = readString(formData, "itemId");

      if (!itemId) throw new Error("A pantry item ID is required.");

      const deletedItems = await db
         .delete(pantryItem)
         .where(and(eq(pantryItem.id, itemId), eq(pantryItem.ownerId, user.id)))
         .returning({ id: pantryItem.id });

      if (deletedItems.length === 0) {
         throw new Error(
            "Pantry item not found or you don't have permission to delete it.",
         );
      }

      revalidatePath("/pantry");

      return {
         success: true as const,
         message: "Item removed from your pantry.",
      };
   } catch (error) {
      console.error("Error deleting pantry item:", error);
      throw new Error(
         getPublicErrorMessage(error, "Failed to delete the item."),
      );
   }
}

/** Update an item only if it belongs to the signed-in user. */
export async function updatePantryItem(formData: FormData) {
   try {
      const user = await requireUser();
      const itemId = readString(formData, "itemId");
      const name = readString(formData, "name");
      const quantity = readString(formData, "quantity");

      if (!itemId) throw new Error("A pantry item ID is required.");
      if (!name) throw new Error("Ingredient name is required.");

      const [item] = await db
         .update(pantryItem)
         .set({
            name: name.slice(0, 120),
            quantity: quantity ? quantity.slice(0, 120) : null,
            updatedAt: new Date(),
         })
         .where(and(eq(pantryItem.id, itemId), eq(pantryItem.ownerId, user.id)))
         .returning();

      if (!item) {
         throw new Error(
            "Pantry item not found or you don't have permission to update it.",
         );
      }

      revalidatePath("/pantry");

      return {
         success: true as const,
         item,
         message: "Pantry item updated successfully.",
      };
   } catch (error) {
      console.error("Error updating pantry item:", error);
      throw new Error(
         getPublicErrorMessage(error, "Failed to update the item."),
      );
   }
}
