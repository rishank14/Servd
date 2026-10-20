"use client";

import { useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import useFetch from "@/hooks/use-fetch";
import RecipeCard from "@/components/RecipeCard";

type MealGridItem = {
   idMeal: string;
   strMeal: string;
   strMealThumb: string;
   [key: string]: unknown;
};

type RecipeGridProps = {
   type: "category" | "cuisine";
   value: string;
   fetchAction: (value: string) => Promise<{ meals: MealGridItem[] }>;
   backLink?: string;
};

export default function RecipeGrid({
   type,
   value,
   fetchAction,
   backLink = "/dashboard",
}: RecipeGridProps) {
   const { loading, data, fn: fetchMeals } = useFetch(fetchAction);

   useEffect(() => {
      if (value) {
         const formattedValue = value
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

         fetchMeals(formattedValue);
      }
   }, [value, fetchMeals]);

   const meals = data?.meals || [];
   const displayName = value?.replace(/-/g, " ") || "";

   return (
      <main className="min-h-screen bg-[#fffdf8] px-4 pb-16 pt-14 sm:px-6 lg:px-8">
         <div className="mx-auto max-w-7xl">
            {/* Header */}
            <header className="mb-8">
               <Link
                  href={backLink}
                  className="mb-4 inline-flex items-center gap-2 text-stone-600 transition-colors hover:text-[#d13228]"
               >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
               </Link>

               <h1 className="text-4xl font-bold capitalize leading-tight tracking-tight text-stone-900 sm:text-5xl md:text-6xl">
                  {displayName}{" "}
                  <span className="text-[#d13228]">
                     {type === "cuisine" ? "Cuisine" : "Recipes"}
                  </span>
               </h1>

               {!loading && meals.length > 0 && (
                  <p className="mt-2 text-stone-600">
                     {meals.length} delicious {displayName}{" "}
                     {type === "cuisine" ? "dishes" : "recipes"} to try
                  </p>
               )}
            </header>

            {/* Loading State */}
            {loading && (
               <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#d13228]" />
                  <p className="text-stone-500">Loading recipes...</p>
               </div>
            )}

            {/* Meals Grid */}
            {!loading && meals.length > 0 && (
               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {meals.map((meal) => (
                     <RecipeCard
                        key={meal.idMeal}
                        recipe={meal}
                        variant="grid"
                     />
                  ))}
               </div>
            )}

            {/* Empty State */}
            {!loading && meals.length === 0 && (
               <div className="py-20 text-center">
                  <div className="mb-4 text-6xl">🍽️</div>

                  <h3 className="mb-2 text-2xl font-bold text-stone-900">
                     No recipes found
                  </h3>

                  <p className="mb-6 text-stone-500">
                     We couldn&apos;t find any {displayName}{" "}
                     {type === "cuisine" ? "dishes" : "recipes"}.
                  </p>

                  <Link
                     href={backLink}
                     className="inline-flex items-center gap-2 font-semibold text-[#d13228] transition-colors hover:text-[#b92720]"
                  >
                     <ArrowLeft className="h-4 w-4" />
                     Go back to explore more
                  </Link>
               </div>
            )}
         </div>
      </main>
   );
}
