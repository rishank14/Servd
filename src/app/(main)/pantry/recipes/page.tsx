"use client";

import { useEffect } from "react";
import {
   ArrowLeft,
   ChefHat,
   Loader2,
   Sparkles,
   AlertCircle,
   TrendingUp,
   Package,
   RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useFetch from "@/hooks/use-fetch";
import { getRecipesByPantryIngredients } from "@/actions/recipe.actions";
import RecipeCard from "@/components/RecipeCard";
import { capitalize } from "@/lib/utils";

export default function PantryRecipesPage() {
   const {
      loading,
      data: recipesData,
      fn: fetchSuggestions,
   } = useFetch(getRecipesByPantryIngredients);

   useEffect(() => {
      fetchSuggestions();
   }, [fetchSuggestions]);

   const recipes = recipesData?.recipes ?? [];
   const ingredientsUsed = recipesData?.ingredientsUsed ?? "";

   const hasError = recipesData?.success === false;
   const hasLoaded = recipesData !== undefined && recipesData !== null;

   return (
      <main className="min-h-screen bg-[#fffdf8] px-4 pb-16 pt-12 text-stone-900 sm:px-6 lg:px-8">
         <div className="mx-auto max-w-6xl">
            {/* Header */}
            <header className="mb-10">
               <Link
                  href="/pantry"
                  className="mb-5 inline-flex items-center gap-2 font-medium text-stone-600 transition-colors hover:text-[#d13228]"
               >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Pantry
               </Link>

               <div className="flex items-center gap-4">
                  <ChefHat
                     className="mt-1 size-16 shrink-0 text-[#d13228]"
                     strokeWidth={1.8}
                     aria-hidden="true"
                  />

                  <div>
                     <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                        What Can I Cook?
                     </h1>
                     <p className="mt-1 text-sm text-stone-600 sm:text-base">
                        Discover recipes using ingredients you already have.
                     </p>
                  </div>
               </div>

               {/* Ingredients used */}
               {ingredientsUsed && (
                  <div className="mt-7 rounded-2xl border border-stone-200 bg-white p-5">
                     <div className="flex items-start gap-3">
                        <Package className="mt-0.5 h-5 w-5 shrink-0 text-[#d13228]" />
                        <div className="flex-1">
                           <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                              <h2 className="font-semibold text-stone-900">
                                 Ingredients in your pantry
                              </h2>
                              <Badge
                                 variant="outline"
                                 className="rounded-full border-stone-200 bg-stone-50 px-2.5 py-0.5 text-xs font-normal text-stone-600"
                              >
                                 {ingredientsUsed.split(", ").length}{" "}
                                 {ingredientsUsed.split(", ").length === 1
                                    ? "Ingredient"
                                    : "Ingredients"}
                              </Badge>
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {ingredientsUsed.split(", ").map((ingredient, i) => (
                                 <Badge
                                    key={i}
                                    variant="outline"
                                    className="border-stone-200 bg-stone-50 font-normal text-stone-700"
                                 >
                                    {capitalize(ingredient)}
                                 </Badge>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </header>

            {/* Loading state */}
            {loading && (
               <section
                  className="flex flex-col items-center justify-center py-20 text-center"
                  aria-live="polite"
               >
                  <Loader2 className="mb-5 h-10 w-10 animate-spin text-[#d13228]" />
                  <h2 className="text-xl font-bold text-stone-900 sm:text-2xl">
                     Finding recipes for you...
                  </h2>
                  <p className="mt-2 text-sm text-stone-600">
                     Your AI chef is looking at your available ingredients.
                  </p>
               </section>
            )}

            {/* Recipe suggestions */}
            {!loading && recipes.length > 0 && (
               <section>
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                     <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-[#d13228]" />
                        <h2 className="text-xl font-bold text-stone-900 sm:text-2xl">
                           Recipe Suggestions
                        </h2>
                     </div>

                     <Badge
                        variant="outline"
                        className="rounded-full border-stone-200 bg-white px-3 py-1 text-stone-700"
                     >
                        {recipes.length}{" "}
                        {recipes.length === 1 ? "Recipe" : "Recipes"}
                     </Badge>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                     {recipes.map((recipe, index) => (
                        <RecipeCard
                           key={`${recipe.title}-${index}`}
                           recipe={recipe}
                           variant="pantry"
                        />
                     ))}
                  </div>

                  <div className="mt-10 flex justify-center">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => fetchSuggestions()}
                        disabled={loading}
                        className="gap-2 rounded-xl border-stone-300 text-stone-700 hover:border-[#d13228] hover:bg-orange-50 hover:text-[#d13228]"
                     >
                        <RefreshCw className="h-4 w-4" />
                        Get New Suggestions
                     </Button>
                  </div>
               </section>
            )}

            {/* Empty pantry / no suggestions */}
            {!loading && hasError && (
               <section className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center sm:px-12">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
                     <AlertCircle className="h-8 w-8 text-[#d13228]" />
                  </div>

                  <h2 className="text-2xl font-bold text-stone-900">
                     Let&apos;s Fill Your Pantry
                  </h2>

                  <p className="mx-auto mb-7 mt-3 max-w-md text-sm leading-relaxed text-stone-600 sm:text-base">
                     {recipesData?.message ||
                        "Add some ingredients to your pantry and we'll help you discover recipes you can make."}
                  </p>

                  <div className="flex flex-col justify-center gap-3 sm:flex-row">
                     <Link href="/pantry">
                        <Button className="w-full gap-2 rounded-xl bg-[#d13228] text-white hover:bg-[#b82720] sm:w-auto">
                           <Package className="h-4 w-4" />
                           Manage My Pantry
                        </Button>
                     </Link>

                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => fetchSuggestions()}
                        className="gap-2 rounded-xl border-stone-300 hover:bg-stone-50"
                     >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                     </Button>
                  </div>
               </section>
            )}

            {/* No recipes returned */}
            {!loading && hasLoaded && !hasError && recipes.length === 0 && (
               <section className="rounded-2xl border border-stone-200 bg-white px-6 py-12 text-center sm:px-12">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
                     <Sparkles className="h-8 w-8 text-[#d13228]" />
                  </div>

                  <h2 className="text-2xl font-bold text-stone-900">
                     No Recipes Found Yet
                  </h2>

                  <p className="mx-auto mb-7 mt-3 max-w-md text-sm leading-relaxed text-stone-600 sm:text-base">
                     Try adding more ingredients to your pantry to discover more
                     cooking possibilities.
                  </p>

                  <Link href="/pantry">
                     <Button className="gap-2 rounded-xl bg-[#d13228] text-white hover:bg-[#b82720]">
                        <Package className="h-4 w-4" />
                        View My Pantry
                     </Button>
                  </Link>
               </section>
            )}

            {/* Initial state or unexpected missing response */}
            {!loading && !hasLoaded && (
               <section className="py-12 text-center">
                  <p className="text-sm text-stone-500">
                     Preparing your recipe suggestions...
                  </p>
               </section>
            )}
         </div>
      </main>
   );
}
