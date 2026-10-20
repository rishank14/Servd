
CREATE TYPE "public"."cuisine" AS ENUM(
  'italian', 'chinese', 'mexican', 'indian', 'american',
  'thai', 'japanese', 'mediterranean', 'french', 'korean',
  'vietnamese', 'spanish', 'greek', 'turkish', 'moroccan',
  'brazilian', 'caribbean', 'middle-eastern', 'british',
  'german', 'portuguese', 'other'
);
--> statement-breakpoint

CREATE TYPE "public"."recipe_category" AS ENUM(
  'breakfast', 'lunch', 'dinner', 'snack', 'dessert'
);
--> statement-breakpoint

CREATE TABLE "pantry_item" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "quantity" text,
  "image_url" text,
  "owner_id" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE "recipe" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "cuisine" "cuisine",
  "category" "recipe_category",
  "ingredients" jsonb NOT NULL,
  "instructions" jsonb NOT NULL,
  "image_url" text,
  "is_public" boolean DEFAULT true NOT NULL,
  "author_id" text NOT NULL,
  "prep_time" integer,
  "cook_time" integer,
  "servings" integer,
  "nutrition" jsonb,
  "tips" jsonb,
  "substitutions" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE "saved_recipe" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL,
  "recipe_id" uuid NOT NULL,
  "saved_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

ALTER TABLE "pantry_item"
  ADD CONSTRAINT "pantry_item_owner_id_user_id_fk"
  FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id")
  ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

ALTER TABLE "recipe"
  ADD CONSTRAINT "recipe_author_id_user_id_fk"
  FOREIGN KEY ("author_id") REFERENCES "public"."user"("id")
  ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

ALTER TABLE "saved_recipe"
  ADD CONSTRAINT "saved_recipe_user_id_user_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "public"."user"("id")
  ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

ALTER TABLE "saved_recipe"
  ADD CONSTRAINT "saved_recipe_recipe_id_recipe_id_fk"
  FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id")
  ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

CREATE INDEX "pantry_item_ownerId_idx"
  ON "pantry_item" USING btree ("owner_id");
--> statement-breakpoint

CREATE INDEX "recipe_authorId_idx"
  ON "recipe" USING btree ("author_id");
--> statement-breakpoint

CREATE INDEX "recipe_isPublic_idx"
  ON "recipe" USING btree ("is_public");
--> statement-breakpoint

CREATE INDEX "recipe_cuisine_idx"
  ON "recipe" USING btree ("cuisine");
--> statement-breakpoint

CREATE INDEX "recipe_category_idx"
  ON "recipe" USING btree ("category");
--> statement-breakpoint

CREATE UNIQUE INDEX "saved_recipe_user_recipe_unique"
  ON "saved_recipe" USING btree ("user_id", "recipe_id");
--> statement-breakpoint

CREATE INDEX "saved_recipe_userId_idx"
  ON "saved_recipe" USING btree ("user_id");
--> statement-breakpoint

CREATE INDEX "saved_recipe_recipeId_idx"
  ON "saved_recipe" USING btree ("recipe_id");
