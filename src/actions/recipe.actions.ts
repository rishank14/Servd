"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { and, desc, eq, ilike } from "drizzle-orm";

import { db } from "@/db";
import {
   cuisineEnum,
   pantryItem,
   recipe,
   recipeCategoryEnum,
   savedRecipe,
} from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { capitalize } from "@/lib/utils";

type RecipeCategory = (typeof recipeCategoryEnum.enumValues)[number];
type RecipeCuisine = (typeof cuisineEnum.enumValues)[number];

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const genAI = GEMINI_API_KEY
   ? new GoogleGenerativeAI(GEMINI_API_KEY)
   : null;

const MODEL_NAME = "gemini-3.5-flash-lite";

const validCategories = [
   "breakfast",
   "lunch",
   "dinner",
   "snack",
   "dessert",
] as const;

const validCuisines = [
   "italian",
   "chinese",
   "mexican",
   "indian",
   "american",
   "thai",
   "japanese",
   "mediterranean",
   "french",
   "korean",
   "vietnamese",
   "spanish",
   "greek",
   "turkish",
   "moroccan",
   "brazilian",
   "caribbean",
   "middle-eastern",
   "british",
   "german",
   "portuguese",
   "other",
] as const;

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeTitle(title: string) {
   return title
      .trim()
      .split(/\s+/)
      .map(
         (word) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
}

function getGeminiModel() {
   if (!genAI) {
      throw new Error("Gemini API key is missing. Check your .env file.");
   }

   return genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: { responseMimeType: "application/json" },
   });
}

function parseGeminiJSON<T>(text: string): T {
   const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

   try {
      return JSON.parse(cleaned) as T;
   } catch {
      const match = cleaned.match(/\[[\s\S]*\]/) || cleaned.match(/\{[\s\S]*\}/);
      if (match) {
         try {
            return JSON.parse(match[0]) as T;
         } catch {
            // Fall through to error
         }
      }
      throw new Error("AI returned an invalid response. Please try again.");
   }
}

function normalizeCategory(value: unknown): RecipeCategory {
   const category =
      typeof value === "string" ? value.toLowerCase() : "";

   return (validCategories as readonly string[]).includes(category)
      ? (category as RecipeCategory)
      : "dinner";
}

function normalizeCuisine(value: unknown): RecipeCuisine {
   const cuisine =
      typeof value === "string" ? value.toLowerCase() : "";

   return (validCuisines as readonly string[]).includes(cuisine)
      ? (cuisine as RecipeCuisine)
      : "other";
}

function toPositiveNumber(value: unknown, fallback: number) {
   const number = Number(value);

   return Number.isFinite(number) && number > 0
      ? Math.round(number)
      : fallback;
}

async function fetchRecipeImage(recipeName: string): Promise<string> {
   if (!UNSPLASH_ACCESS_KEY) return "";

   // Strip parentheses, special punctuation, and extra whitespace for cleaner search
   const cleanName = recipeName
      .replace(/\s*\([^)]*\)/g, "")
      .replace(/[^a-zA-Z0-9 ]/g, " ")
      .trim();

   const queries = [
      `${cleanName} food`,
      cleanName,
      cleanName.split(/\s+/).slice(0, 3).join(" ") + " food",
      cleanName.split(/\s+/).slice(0, 3).join(" "),
   ];

   for (const query of queries) {
      if (!query.trim()) continue;
      try {
         const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
               query
            )}&per_page=1&orientation=landscape`,
            {
               headers: {
                  Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
               },
               next: { revalidate: 86400 },
            }
         );

         if (!response.ok) continue;

         const data = await response.json();
         const imageUrl = data.results?.[0]?.urls?.regular;

         if (imageUrl) {
            return imageUrl;
         }
      } catch (error) {
         console.error(`Recipe image lookup failed for query "${query}":`, error);
      }
   }

   return "";
}

async function getSavedStatus(userId: string, recipeId: string) {
   const [saved] = await db
      .select({ id: savedRecipe.id })
      .from(savedRecipe)
      .where(
         and(
            eq(savedRecipe.userId, userId),
            eq(savedRecipe.recipeId, recipeId)
         )
      )
      .limit(1);

   return Boolean(saved);
}

function getErrorMessage(error: unknown, fallback: string) {
   return error instanceof Error ? error.message : fallback;
}

// -----------------------------------------------------------------------------
// Get an existing recipe or generate a new one with Gemini
// -----------------------------------------------------------------------------

export async function getOrGenerateRecipe(formData: FormData) {
   try {
      const user = await getCurrentUser();

      if (!user) {
         throw new Error("Please sign in to view recipes.");
      }

      const recipeName = formData.get("recipeName");

      if (typeof recipeName !== "string" || !recipeName.trim()) {
         throw new Error("Recipe name is required.");
      }

      const normalizedTitle = normalizeTitle(recipeName);

      // Check whether the recipe already exists in Neon.
      const [existingRecipe] = await db
         .select()
         .from(recipe)
         .where(ilike(recipe.title, normalizedTitle))
         .limit(1);

      if (existingRecipe) {
         // If existing recipe doesn't have an image, fetch and persist it now
         if (!existingRecipe.imageUrl) {
            const fetchedImage = await fetchRecipeImage(existingRecipe.title);
            if (fetchedImage) {
               existingRecipe.imageUrl = fetchedImage;
               await db
                  .update(recipe)
                  .set({ imageUrl: fetchedImage })
                  .where(eq(recipe.id, existingRecipe.id));
            }
         }

         const isSaved = await getSavedStatus(
            user.id,
            existingRecipe.id
         );

         return {
            success: true,
            recipe: existingRecipe,
            recipeId: existingRecipe.id,
            isSaved,
            fromDatabase: true,
            message: "Recipe loaded successfully.",
         };
      }

      // Generate a recipe when it doesn't exist.
      const model = getGeminiModel();

      const prompt = `
You are a professional chef. Generate a detailed recipe for "${normalizedTitle}".

The title must be exactly "${normalizedTitle}".

Return ONLY valid JSON with this structure:
{
  "title": "${normalizedTitle}",
  "description": "A brief 2-3 sentence description",
  "category": "breakfast, lunch, dinner, snack, or dessert",
  "cuisine": "A valid lowercase cuisine",
  "prepTime": 10,
  "cookTime": 20,
  "servings": 2,
  "ingredients": [
    {
      "item": "ingredient name",
      "amount": "quantity and unit",
      "category": "Protein, Vegetable, Spice, Dairy, Grain, or Other"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "title": "Step title",
      "instruction": "Detailed instructions",
      "tip": "Optional tip"
    }
  ],
  "nutrition": {
    "calories": "300",
    "protein": "15g",
    "carbs": "30g",
    "fat": "10g"
  },
  "tips": ["Useful cooking tip"],
  "substitutions": [
    {
      "original": "ingredient",
      "alternatives": ["alternative"]
    }
  ]
}

Allowed categories: ${validCategories.join(", ")}.
Allowed cuisines: ${validCuisines.join(", ")}.

Rules:
- Use realistic, commonly available ingredients.
- Include 6-10 beginner-friendly cooking steps.
- prepTime, cookTime, and servings must be numbers.
- ingredients and instructions must be arrays.
- Make the instructions practical and detailed.
- Return JSON only, without markdown.
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const generated = parseGeminiJSON<{
         title?: string;
         description?: string;
         category?: string;
         cuisine?: string;
         prepTime?: number | string;
         cookTime?: number | string;
         servings?: number | string;
         ingredients?: unknown[];
         instructions?: unknown[];
         nutrition?: Record<string, unknown>;
         tips?: unknown[];
         substitutions?: unknown[];
      }>(responseText);

      if (
         !Array.isArray(generated.ingredients) ||
         !Array.isArray(generated.instructions) ||
         generated.ingredients.length === 0 ||
         generated.instructions.length === 0
      ) {
         throw new Error("The generated recipe is incomplete. Please try again.");
      }

      const category = normalizeCategory(generated.category);
      const cuisine = normalizeCuisine(generated.cuisine);
      const imageUrl = await fetchRecipeImage(normalizedTitle);

      const formattedIngredients = generated.ingredients.map((ing) => {
         if (typeof ing === "object" && ing !== null) {
            const itemObj = ing as Record<string, unknown>;
            return {
               ...itemObj,
               item: capitalize(
                  typeof itemObj.item === "string"
                     ? itemObj.item
                     : String(itemObj.item || "")
               ),
            };
         }
         return ing;
      });

      const formattedSubstitutions = Array.isArray(generated.substitutions)
         ? generated.substitutions.map((sub) => {
            if (typeof sub === "object" && sub !== null) {
               const subObj = sub as Record<string, unknown>;
               return {
                  ...subObj,
                  original: capitalize(
                     typeof subObj.original === "string"
                        ? subObj.original
                        : String(subObj.original || "")
                  ),
                  alternatives: Array.isArray(subObj.alternatives)
                     ? subObj.alternatives.map((alt) =>
                        capitalize(
                           typeof alt === "string"
                              ? alt
                              : String(alt || "")
                        )
                     )
                     : [],
               };
            }
            return sub;
         })
         : [];

      // Persist the generated recipe using Drizzle.
      const [createdRecipe] = await db
         .insert(recipe)
         .values({
            title: normalizedTitle,
            description: generated.description ?? "",
            category,
            cuisine,
            ingredients: formattedIngredients,
            instructions: generated.instructions,
            prepTime: toPositiveNumber(generated.prepTime, 10),
            cookTime: toPositiveNumber(generated.cookTime, 20),
            servings: toPositiveNumber(generated.servings, 2),
            nutrition: generated.nutrition ?? {},
            tips: generated.tips ?? [],
            substitutions: formattedSubstitutions,
            imageUrl,
            isPublic: true,
            authorId: user.id,
         })
         .returning();

      if (!createdRecipe) {
         throw new Error("Failed to save the generated recipe.");
      }

      return {
         success: true,
         recipe: createdRecipe,
         recipeId: createdRecipe.id,
         isSaved: false,
         fromDatabase: false,
         message: "Recipe generated and saved successfully!",
      };
   } catch (error) {
      console.error("getOrGenerateRecipe error:", error);
      throw new Error(
         getErrorMessage(error, "Failed to load the recipe.")
      );
   }
}

// -----------------------------------------------------------------------------
// Save a recipe to the current user's collection
// -----------------------------------------------------------------------------

export async function saveRecipeToCollection(formData: FormData) {
   try {
      const user = await getCurrentUser();

      if (!user) {
         throw new Error("Please sign in to save recipes.");
      }

      const recipeId = formData.get("recipeId");

      if (typeof recipeId !== "string" || !recipeId.trim()) {
         throw new Error("Recipe ID is required.");
      }

      const [existingRecipe] = await db
         .select({ id: recipe.id })
         .from(recipe)
         .where(eq(recipe.id, recipeId))
         .limit(1);

      if (!existingRecipe) {
         throw new Error("Recipe not found.");
      }

      const alreadySaved = await getSavedStatus(user.id, recipeId);

      if (alreadySaved) {
         return {
            success: true,
            alreadySaved: true,
            message: "Recipe is already in your collection.",
         };
      }

      await db
         .insert(savedRecipe)
         .values({
            userId: user.id,
            recipeId,
            savedAt: new Date(),
         })
         .onConflictDoNothing();

      return {
         success: true,
         alreadySaved: false,
         message: "Recipe saved to your collection!",
      };
   } catch (error) {
      console.error("saveRecipeToCollection error:", error);
      throw new Error(
         getErrorMessage(error, "Failed to save the recipe.")
      );
   }
}

// -----------------------------------------------------------------------------
// Remove a recipe from the current user's collection
// -----------------------------------------------------------------------------

export async function removeRecipeFromCollection(formData: FormData) {
   try {
      const user = await getCurrentUser();

      if (!user) {
         throw new Error("Please sign in to manage saved recipes.");
      }

      const recipeId = formData.get("recipeId");

      if (typeof recipeId !== "string" || !recipeId.trim()) {
         throw new Error("Recipe ID is required.");
      }

      await db
         .delete(savedRecipe)
         .where(
            and(
               eq(savedRecipe.userId, user.id),
               eq(savedRecipe.recipeId, recipeId)
            )
         );

      return {
         success: true,
         message: "Recipe removed from your collection.",
      };
   } catch (error) {
      console.error("removeRecipeFromCollection error:", error);
      throw new Error(
         getErrorMessage(error, "Failed to remove the recipe.")
      );
   }
}

// -----------------------------------------------------------------------------
// Generate recipe suggestions from the user's pantry
// -----------------------------------------------------------------------------

export async function getRecipesByPantryIngredients() {
   try {
      const user = await getCurrentUser();

      if (!user) {
         throw new Error("Please sign in to get pantry recipe suggestions.");
      }

      const pantryItems = await db
         .select({
            name: pantryItem.name,
            quantity: pantryItem.quantity,
         })
         .from(pantryItem)
         .where(eq(pantryItem.ownerId, user.id))
         .orderBy(desc(pantryItem.createdAt));

      if (pantryItems.length === 0) {
         return {
            success: false,
            recipes: [],
            ingredientsUsed: "",
            message: "Your pantry is empty. Add ingredients first!",
         };
      }

      const ingredients = pantryItems
         .map((item) =>
            item.quantity
               ? `${capitalize(item.name)} (${item.quantity})`
               : capitalize(item.name)
         )
         .join(", ");

      const model = getGeminiModel();

      const prompt = `
You are a professional chef.

The user has these ingredients available:
${ingredients}

Suggest 5 realistic recipes that can primarily be made with these ingredients.
Common staples such as salt, pepper, and cooking oil may be assumed.

Return ONLY a valid JSON array:
[
  {
    "title": "Recipe name",
    "description": "Brief 1-2 sentence description",
    "matchPercentage": 85,
    "missingIngredients": ["ingredient1"],
    "category": "dinner",
    "cuisine": "indian",
    "prepTime": 20,
    "cookTime": 30,
    "servings": 2
  }
]

Rules:
- Suggest up to 5 distinct recipes.
- matchPercentage must be a number between 70 and 100.
- Sort recipes by matchPercentage, highest first.
- missingIngredients should list useful missing ingredients.
- prepTime, cookTime, and servings must be numbers.
- category must be one of: ${validCategories.join(", ")}.
- cuisine must be one of: ${validCuisines.join(", ")}.
- Return JSON only, without markdown.
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const suggestions = parseGeminiJSON<
         Array<{
            title: string;
            description: string;
            matchPercentage: number;
            missingIngredients: string[];
            category: string;
            cuisine: string;
            prepTime: number;
            cookTime: number;
            servings: number;
         }>
      >(responseText);

      if (!Array.isArray(suggestions)) {
         throw new Error("AI returned an invalid recipe list. Please try again.");
      }

      const recipes = suggestions
         .filter(
            (item) =>
               item &&
               typeof item.title === "string" &&
               item.title.trim().length > 0
         )
         .slice(0, 5)
         .map((item) => ({
            ...item,
            category: normalizeCategory(item.category),
            cuisine: normalizeCuisine(item.cuisine),
            matchPercentage: Math.min(
               100,
               Math.max(70, Number(item.matchPercentage) || 70)
            ),
            missingIngredients: Array.isArray(item.missingIngredients)
               ? item.missingIngredients.map((ing) =>
                  capitalize(typeof ing === "string" ? ing : String(ing || ""))
               )
               : [],
            prepTime: toPositiveNumber(item.prepTime, 10),
            cookTime: toPositiveNumber(item.cookTime, 20),
            servings: toPositiveNumber(item.servings, 2),
         }))
         .sort((a, b) => b.matchPercentage - a.matchPercentage);

      return {
         success: true,
         recipes,
         ingredientsUsed: ingredients,
         message: `Found ${recipes.length} recipe suggestions!`,
      };
   } catch (error) {
      console.error("getRecipesByPantryIngredients error:", error);
      throw new Error(
         getErrorMessage(error, "Failed to get recipe suggestions.")
      );
   }
}

// -----------------------------------------------------------------------------
// Get the current user's saved recipes
// -----------------------------------------------------------------------------

export async function getSavedRecipes() {
   try {
      const user = await getCurrentUser();

      if (!user) {
         throw new Error("Please sign in to view your saved recipes.");
      }

      const rows = await db
         .select({
            savedAt: savedRecipe.savedAt,
            recipe: recipe,
         })
         .from(savedRecipe)
         .innerJoin(recipe, eq(savedRecipe.recipeId, recipe.id))
         .where(eq(savedRecipe.userId, user.id))
         .orderBy(desc(savedRecipe.savedAt));

      const recipes = rows.map((row) => ({
         ...row.recipe,
         savedAt: row.savedAt,
      }));

      return {
         success: true,
         recipes,
         count: recipes.length,
      };
   } catch (error) {
      console.error("getSavedRecipes error:", error);
      throw new Error(
         getErrorMessage(error, "Failed to load saved recipes.")
      );
   }
}
