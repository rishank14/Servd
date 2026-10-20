
import { relations } from "drizzle-orm";
import {
   pgTable,
   pgEnum,
   text,
   timestamp,
   boolean,
   integer,
   uuid,
   jsonb,
   index,
   uniqueIndex,
} from "drizzle-orm/pg-core";

// ==========================================
// ENUMS
// ==========================================

export const cuisineEnum = pgEnum("cuisine", [
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
]);

export const recipeCategoryEnum = pgEnum("recipe_category", [
   "breakfast",
   "lunch",
   "dinner",
   "snack",
   "dessert",
]);

// ==========================================
// BETTER AUTH TABLES
// Keep these compatible with your auth setup.
// ==========================================

export const user = pgTable("user", {
   id: text("id").primaryKey(),
   name: text("name").notNull(),
   email: text("email").notNull().unique(),
   emailVerified: boolean("email_verified").default(false).notNull(),
   image: text("image"),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
});

export const session = pgTable(
   "session",
   {
      id: text("id").primaryKey(),
      expiresAt: timestamp("expires_at").notNull(),
      token: text("token").notNull().unique(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
         .$onUpdate(() => new Date())
         .notNull(),
      ipAddress: text("ip_address"),
      userAgent: text("user_agent"),
      userId: text("user_id")
         .notNull()
         .references(() => user.id, { onDelete: "cascade" }),
   },
   (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
   "account",
   {
      id: text("id").primaryKey(),
      accountId: text("account_id").notNull(),
      providerId: text("provider_id").notNull(),
      userId: text("user_id")
         .notNull()
         .references(() => user.id, { onDelete: "cascade" }),
      accessToken: text("access_token"),
      refreshToken: text("refresh_token"),
      idToken: text("id_token"),
      accessTokenExpiresAt: timestamp("access_token_expires_at"),
      refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
      scope: text("scope"),
      password: text("password"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
         .$onUpdate(() => new Date())
         .notNull(),
   },
   (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
   "verification",
   {
      id: text("id").primaryKey(),
      identifier: text("identifier").notNull(),
      value: text("value").notNull(),
      expiresAt: timestamp("expires_at").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
         .defaultNow()
         .$onUpdate(() => new Date())
         .notNull(),
   },
   (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ==========================================
// RECIPES
// ==========================================

export const recipe = pgTable(
   "recipe",
   {
      id: uuid("id").defaultRandom().primaryKey(),

      title: text("title").notNull(),
      description: text("description"),

      cuisine: cuisineEnum("cuisine"),
      category: recipeCategoryEnum("category"),

      // Structured ingredient and instruction data.
      ingredients: jsonb("ingredients").notNull(),
      instructions: jsonb("instructions").notNull(),

      imageUrl: text("image_url"),

      isPublic: boolean("is_public").default(true).notNull(),

      // Better Auth user ID, not a Clerk ID.
      authorId: text("author_id")
         .notNull()
         .references(() => user.id, { onDelete: "cascade" }),

      prepTime: integer("prep_time"),
      cookTime: integer("cook_time"),
      servings: integer("servings"),

      nutrition: jsonb("nutrition"),
      tips: jsonb("tips"),
      substitutions: jsonb("substitutions"),

      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
         .defaultNow()
         .$onUpdate(() => new Date())
         .notNull(),
   },
   (table) => [
      index("recipe_authorId_idx").on(table.authorId),
      index("recipe_isPublic_idx").on(table.isPublic),
      index("recipe_cuisine_idx").on(table.cuisine),
      index("recipe_category_idx").on(table.category),
   ],
);

// ==========================================
// PANTRY ITEMS
// ==========================================

export const pantryItem = pgTable(
   "pantry_item",
   {
      id: uuid("id").defaultRandom().primaryKey(),

      name: text("name").notNull(),
      quantity: text("quantity"),
      imageUrl: text("image_url"),

      ownerId: text("owner_id")
         .notNull()
         .references(() => user.id, { onDelete: "cascade" }),

      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
         .defaultNow()
         .$onUpdate(() => new Date())
         .notNull(),
   },
   (table) => [
      index("pantry_item_ownerId_idx").on(table.ownerId),
   ],
);

// ==========================================
// SAVED RECIPES
// ==========================================

export const savedRecipe = pgTable(
   "saved_recipe",
   {
      id: uuid("id").defaultRandom().primaryKey(),

      userId: text("user_id")
         .notNull()
         .references(() => user.id, { onDelete: "cascade" }),

      recipeId: uuid("recipe_id")
         .notNull()
         .references(() => recipe.id, { onDelete: "cascade" }),

      savedAt: timestamp("saved_at").defaultNow().notNull(),
   },
   (table) => [
      uniqueIndex("saved_recipe_user_recipe_unique").on(
         table.userId,
         table.recipeId,
      ),
      index("saved_recipe_userId_idx").on(table.userId),
      index("saved_recipe_recipeId_idx").on(table.recipeId),
   ],
);

// ==========================================
// RELATIONS
// ==========================================

export const userRelations = relations(user, ({ many }) => ({
   sessions: many(session),
   accounts: many(account),
   recipes: many(recipe),
   pantryItems: many(pantryItem),
   savedRecipes: many(savedRecipe),
}));

export const sessionRelations = relations(session, ({ one }) => ({
   user: one(user, {
      fields: [session.userId],
      references: [user.id],
   }),
}));

export const accountRelations = relations(account, ({ one }) => ({
   user: one(user, {
      fields: [account.userId],
      references: [user.id],
   }),
}));

export const recipeRelations = relations(recipe, ({ one, many }) => ({
   author: one(user, {
      fields: [recipe.authorId],
      references: [user.id],
   }),
   savedBy: many(savedRecipe),
}));

export const pantryItemRelations = relations(pantryItem, ({ one }) => ({
   owner: one(user, {
      fields: [pantryItem.ownerId],
      references: [user.id],
   }),
}));

export const savedRecipeRelations = relations(savedRecipe, ({ one }) => ({
   user: one(user, {
      fields: [savedRecipe.userId],
      references: [user.id],
   }),
   recipe: one(recipe, {
      fields: [savedRecipe.recipeId],
      references: [recipe.id],
   }),
}));
