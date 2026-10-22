"use client";

import { useEffect } from "react";
import { Bookmark, Loader2, ChefHat, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useFetch from "@/hooks/use-fetch";
import { getSavedRecipes } from "@/actions/recipe.actions";
import RecipeCard from "@/components/RecipeCard";

export default function SavedRecipesPage() {
   const {
      loading,
      data: recipesData,
      fn: fetchSavedRecipes,
   } = useFetch(getSavedRecipes);

   useEffect(() => {
      fetchSavedRecipes();
   }, [fetchSavedRecipes]);

   const hasLoaded = recipesData !== undefined;
   const recipes = recipesData?.recipes ?? [];

   return (
      <main className="min-h-screen bg-[#fffdf8] px-4 pb-16 pt-12 text-stone-900 sm:px-6 lg:px-8">
         <div className="mx-auto max-w-7xl">
            {/* Header */}
            <header className="mb-8">
               <div className="flex items-center gap-4">
                  <Bookmark
                     className="size-12 sm:size-14 shrink-0 text-[#d13228]"
                     strokeWidth={1.8}
                     aria-hidden="true"
                  />

                  <div>
                     <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                        My Saved Recipes
                     </h1>
                     <p className="mt-1 text-sm text-stone-600 sm:text-base">
                        Your personal collection of favorite recipes
                     </p>
                  </div>
               </div>
            </header>

            {/* Loading State */}
            {(loading || !hasLoaded) && (
               <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Loader2 className="mb-5 h-10 w-10 animate-spin text-[#d13228]" />
                  <p className="text-stone-600">
                     Loading your saved recipes...
                  </p>
               </div>
            )}

            {/* Recipes Grid */}
            {!loading && hasLoaded && recipes.length > 0 && (
               <section>
                  <div className="mb-6 flex items-center justify-between gap-3">
                     <p className="text-sm font-medium text-stone-500">
                        Saved in your collection
                     </p>
                     <Badge
                        variant="outline"
                        className="rounded-full border-stone-200 bg-white px-3 py-1 text-stone-700"
                     >
                        {recipes.length}{" "}
                        {recipes.length === 1 ? "Recipe" : "Recipes"}
                     </Badge>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                     {recipes.map((recipe) => (
                        <RecipeCard
                           key={recipe.id}
                           recipe={recipe}
                           variant="list"
                        />
                     ))}
                  </div>
               </section>
            )}

            {/* Empty State */}
            {!loading && hasLoaded && recipes.length === 0 && (
               <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center sm:px-12">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff5f2]">
                     <Bookmark className="h-10 w-10 text-[#d13228]" />
                  </div>

                  <h2 className="mb-2 text-2xl font-bold text-stone-900">
                     No Saved Recipes Yet
                  </h2>

                  <p className="mx-auto mb-8 max-w-md leading-6 text-stone-600">
                     Start exploring recipes and save your favorites to build
                     your personal cookbook!
                  </p>

                  <div className="flex flex-col justify-center gap-3 sm:flex-row">
                     <Link href="/dashboard">
                        <Button className="w-full gap-2 rounded-xl bg-[#d13228] text-white hover:bg-[#b82921] sm:w-auto">
                           <ChefHat className="h-4 w-4" />
                           Explore Recipes
                        </Button>
                     </Link>

                     <Link href="/pantry">
                        <Button
                           variant="outline"
                           className="w-full gap-2 rounded-xl border-stone-300 text-stone-700 hover:bg-stone-50 sm:w-auto"
                        >
                           <Package className="h-4 w-4" />
                           Check Your Pantry
                        </Button>
                     </Link>
                  </div>
               </div>
            )}
         </div>
      </main>
   );
}
