import { Globe, ArrowRight, Flame } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CountryFlag from "@/components/country-flag";

import {
   getRecipeOfTheDay,
   getCategories,
   getAreas,
} from "@/actions/mealdb.actions";

import { FEATURED_AREAS, getCategoryEmoji } from "@/lib/data";

export default async function DashboardPage() {
   const [recipeData, categoriesData, areasData] = await Promise.allSettled([
      getRecipeOfTheDay(),
      getCategories(),
      getAreas(),
   ]);

   const recipeOfTheDay =
      recipeData.status === "fulfilled" ? recipeData.value.recipe : null;

   const categories =
      categoriesData.status === "fulfilled"
         ? categoriesData.value.categories
         : [];

   const areas = areasData.status === "fulfilled" ? areasData.value.areas : [];

   // Show only featured cuisines available in the API response.
   const displayedAreas = FEATURED_AREAS.map((featuredArea) =>
      areas.find(
         (area) => area.strArea.toLowerCase() === featuredArea.toLowerCase(),
      ),
   ).filter((area) => area !== undefined);

   return (
      <main className="min-h-screen bg-[#fffdf8] px-4 py-12 sm:px-6 lg:px-8">
         <div className="mx-auto max-w-7xl">
            {/* Dashboard Header */}
            <header className="mb-12">
               <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d13228]/20 bg-[#d13228]/5 px-4 py-2 text-sm font-medium text-[#d13228]">
                  <Flame className="h-4 w-4" />
                  Your daily dose of inspiration
               </div>

               <h1 className="mb-4 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
                  Fresh Recipes,{" "}
                  <span className="text-[#d13228]">Servd Daily.</span>
               </h1>

               <p className="max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
                  Discover delicious recipes from around the world. Find your
                  next favorite meal, explore new cuisines, and make every bite
                  count.
               </p>
            </header>

            {/* Recipe of the Day */}
            {recipeOfTheDay && (
               <section className="mb-20">
                  <div className="mb-6 flex items-center gap-3">
                     <div className="rounded-xl bg-[#d13228]/10 p-2.5">
                        <Flame className="h-6 w-6 text-[#d13228]" />
                     </div>

                     <div>
                        <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
                           Recipe of the Day
                        </h2>

                        <p className="mt-1 text-sm text-stone-500">
                           Something delicious to try today
                        </p>
                     </div>
                  </div>

                  <Link
                     href={`/recipe?cook=${encodeURIComponent(
                        recipeOfTheDay.strMeal,
                     )}`}
                     className="group block overflow-hidden rounded-3xl border border-stone-200 bg-white transition-all duration-300 hover:border-[#d13228]/40 hover:shadow-xl"
                  >
                     <div className="grid md:grid-cols-2">
                        {/* Recipe Image */}
                        <div className="relative aspect-[4/3] min-h-64 overflow-hidden md:aspect-auto">
                           <Image
                              src={recipeOfTheDay.strMealThumb}
                              alt={recipeOfTheDay.strMeal}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              priority
                           />

                           <div className="absolute left-4 top-4">
                              <Badge className="border-0 bg-white/95 px-3 py-1.5 font-semibold text-[#d13228] shadow-sm hover:bg-white">
                                 <Flame className="mr-1.5 h-4 w-4" />
                                 Today&apos;s Special
                              </Badge>
                           </div>
                        </div>

                        {/* Recipe Details */}
                        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
                           <div className="mb-5 flex flex-wrap gap-2">
                              {recipeOfTheDay.strCategory && (
                                 <Badge
                                    variant="outline"
                                    className="rounded-full border-[#d13228]/30 bg-[#d13228]/5 px-3 py-1 text-[#d13228]"
                                 >
                                    {recipeOfTheDay.strCategory}
                                 </Badge>
                              )}

                              {recipeOfTheDay.strArea && (
                                 <Badge
                                    variant="outline"
                                    className="rounded-full border-stone-200 bg-stone-50 px-3 py-1 text-stone-600"
                                 >
                                    <Globe className="mr-1.5 h-3.5 w-3.5" />
                                    {recipeOfTheDay.strArea}
                                 </Badge>
                              )}
                           </div>

                           <h3 className="mb-4 text-3xl font-bold leading-tight text-stone-900 transition-colors group-hover:text-[#d13228] sm:text-4xl">
                              {recipeOfTheDay.strMeal}
                           </h3>

                           <p className="mb-6 line-clamp-3 leading-7 text-stone-600">
                              {recipeOfTheDay.strInstructions
                                 ? `${recipeOfTheDay.strInstructions.slice(0, 200)}...`
                                 : "Discover the ingredients and steps to make this delicious recipe."}
                           </p>

                           {recipeOfTheDay.strTags && (
                              <div className="mb-6 flex flex-wrap gap-2">
                                 {recipeOfTheDay.strTags
                                    .split(",")
                                    .slice(0, 3)
                                    .map((tag) => (
                                       <span
                                          key={tag.trim()}
                                          className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600"
                                       >
                                          {tag.trim()}
                                       </span>
                                    ))}
                              </div>
                           )}

                           <div>
                              <Button className="rounded-full bg-[#d13228] px-6 text-white hover:bg-[#b92720]">
                                 Explore Recipe
                                 <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                           </div>
                        </div>
                     </div>
                  </Link>
               </section>
            )}

            {!recipeOfTheDay && (
               <section className="mb-20 rounded-3xl border border-stone-200 bg-white p-8">
                  <h2 className="text-xl font-bold text-stone-900">
                     Recipe of the Day
                  </h2>

                  <p className="mt-2 text-stone-600">
                     We couldn&apos;t load today&apos;s featured recipe. You can
                     still explore the categories and cuisines below.
                  </p>
               </section>
            )}

            {/* Browse by Category */}
            <section className="mb-20">
               <div className="mb-8">
                  <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                     Browse by Category
                  </h2>

                  <p className="mt-2 text-stone-600">
                     What are you in the mood for today?
                  </p>
               </div>

               {categories.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                     {categories.map((category) => (
                        <Link
                           key={category.strCategory}
                           href={`/recipes/category/${encodeURIComponent(
                              category.strCategory.toLowerCase(),
                           )}`}
                           className="group rounded-2xl border border-stone-200 bg-white p-5 text-center transition-all hover:-translate-y-1 hover:border-[#d13228]/40 hover:shadow-md"
                        >
                           <div className="mb-3 text-4xl transition-transform group-hover:scale-110">
                              {getCategoryEmoji(category.strCategory)}
                           </div>

                           <h3 className="text-sm font-semibold text-stone-800 transition-colors group-hover:text-[#d13228]">
                              {category.strCategory}
                           </h3>
                        </Link>
                     ))}
                  </div>
               ) : (
                  <p className="rounded-2xl border border-stone-200 bg-white p-6 text-stone-600">
                     Categories are temporarily unavailable. Please try again
                     later.
                  </p>
               )}
            </section>

            {/* Explore World Cuisines */}
            <section className="pb-12">
               <div className="mb-8">
                  <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                     Explore World Cuisines
                  </h2>

                  <p className="mt-2 text-stone-600">
                     Discover flavors and cooking traditions from around the
                     world.
                  </p>
               </div>

               {displayedAreas.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                     {displayedAreas.map((area) => (
                        <Link
                           key={area.strArea}
                           href={`/recipes/cuisine/${encodeURIComponent(
                              area.strArea.toLowerCase().replace(/\s+/g, "-"),
                           )}`}
                           className="group flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 transition-all hover:border-[#d13228]/40 hover:shadow-md"
                        >
                           <CountryFlag
                              area={area.strArea}
                              className="transition-transform group-hover:scale-110"
                           />

                           <span className="text-sm font-semibold text-stone-800 transition-colors group-hover:text-[#d13228]">
                              {area.strArea}
                           </span>
                        </Link>
                     ))}
                  </div>
               ) : (
                  <p className="rounded-2xl border border-stone-200 bg-white p-6 text-stone-600">
                     Cuisines are temporarily unavailable. Please try again
                     later.
                  </p>
               )}
            </section>
         </div>
      </main>
   );
}
