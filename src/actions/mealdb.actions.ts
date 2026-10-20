"use server";

const MEALDB_BASE = "https://www.themealdb.com/api/json/v1/1";

type Meal = {
   idMeal: string;
   strMeal: string;
   strMealThumb: string;
   [key: string]: string | null;
};

type MealCategory = {
   strCategory: string;
};

type MealArea = {
   strArea: string;
};

type MealDBResponse<T> = {
   meals: T[] | null;
};

type ActionResult<T> = {
   success: true;
} & T;

async function fetchMealDB<T>(
   endpoint: string,
   revalidate: number,
): Promise<T> {
   const response = await fetch(`${MEALDB_BASE}/${endpoint}`, {
      next: { revalidate },
   });

   if (!response.ok) {
      throw new Error("Failed to fetch data from TheMealDB");
   }

   return response.json() as Promise<T>;
}

// Get random recipe of the day
export async function getRecipeOfTheDay(): Promise<
   ActionResult<{ recipe: Meal }>
> {
   try {
      const data = await fetchMealDB<MealDBResponse<Meal>>(
         "random.php",
         86400,
      );

      if (!data.meals?.[0]) {
         throw new Error("No recipe found");
      }

      return {
         success: true,
         recipe: data.meals[0],
      };
   } catch (error) {
      console.error("Error fetching recipe of the day:", error);

      throw new Error(
         error instanceof Error
            ? error.message
            : "Failed to load recipe",
      );
   }
}

// Get all categories
export async function getCategories(): Promise<
   ActionResult<{ categories: MealCategory[] }>
> {
   try {
      const data = await fetchMealDB<MealDBResponse<MealCategory>>(
         "list.php?c=list",
         604800,
      );

      return {
         success: true,
         categories: data.meals ?? [],
      };
   } catch (error) {
      console.error("Error fetching categories:", error);

      throw new Error(
         error instanceof Error
            ? error.message
            : "Failed to load categories",
      );
   }
}

// Get all areas/cuisines
export async function getAreas(): Promise<
   ActionResult<{ areas: MealArea[] }>
> {
   try {
      const data = await fetchMealDB<MealDBResponse<MealArea>>(
         "list.php?a=list",
         604800,
      );

      return {
         success: true,
         areas: data.meals ?? [],
      };
   } catch (error) {
      console.error("Error fetching areas:", error);

      throw new Error(
         error instanceof Error
            ? error.message
            : "Failed to load areas",
      );
   }
}

// Get meals by category
export async function getMealsByCategory(
   category: string,
): Promise<ActionResult<{ meals: Meal[]; category: string }>> {
   try {
      const data = await fetchMealDB<MealDBResponse<Meal>>(
         `filter.php?c=${encodeURIComponent(category)}`,
         86400,
      );

      return {
         success: true,
         meals: data.meals ?? [],
         category,
      };
   } catch (error) {
      console.error("Error fetching meals by category:", error);

      throw new Error(
         error instanceof Error
            ? error.message
            : "Failed to load meals",
      );
   }
}

// Get meals by area
export async function getMealsByArea(
   area: string,
): Promise<ActionResult<{ meals: Meal[]; area: string }>> {
   try {
      const data = await fetchMealDB<MealDBResponse<Meal>>(
         `filter.php?a=${encodeURIComponent(area)}`,
         86400,
      );

      return {
         success: true,
         meals: data.meals ?? [],
         area,
      };
   } catch (error) {
      console.error("Error fetching meals by area:", error);

      throw new Error(
         error instanceof Error
            ? error.message
            : "Failed to load meals",
      );
   }
}