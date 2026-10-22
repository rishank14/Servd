/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
   ArrowLeft,
   Clock,
   Users,
   ChefHat,
   Flame,
   Lightbulb,
   Bookmark,
   BookmarkCheck,
   Loader2,
   AlertCircle,
   CheckCircle2,
   Download,
} from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ClockLoader } from "react-spinners";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RecipePDF } from "@/components/RecipePDF";
import useFetch from "@/hooks/use-fetch";
import {
   getOrGenerateRecipe,
   saveRecipeToCollection,
   removeRecipeFromCollection,
} from "@/actions/recipe.actions";
import { capitalize } from "@/lib/utils";

type Ingredient = {
   item: string;
   amount: string;
   category?: string;
};

type RecipeInstruction = {
   step: number;
   title: string;
   instruction: string;
   tip?: string;
};

type RecipeSubstitution = {
   original: string;
   alternatives: string[];
};

type RecipeDetails = {
   id?: string;
   title: string;
   description: string;
   cuisine: string;
   category: string;
   imageUrl?: string | null;
   prepTime: string | number;
   cookTime: string | number;
   servings: string | number;
   ingredients: Ingredient[];
   instructions: RecipeInstruction[];
   nutrition?: {
      calories?: string | number;
      protein?: string | number;
      carbs?: string | number;
      fat?: string | number;
   } | null;
   tips?: string[] | null;
   substitutions?: RecipeSubstitution[] | null;
};

type RecipeResponse = {
   success: boolean;
   recipe?: RecipeDetails;
   recipeId?: string;
   isSaved?: boolean;
   fromDatabase?: boolean;
   message?: string;
};

function RecipeContent() {
   const searchParams = useSearchParams();
   const router = useRouter();
   const recipeName = searchParams.get("cook");

   const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
   const [recipeId, setRecipeId] = useState<string | null>(null);
   const [isSaved, setIsSaved] = useState(false);
   const [isClient, setIsClient] = useState(false);
   const [progress, setProgress] = useState(15);

   useEffect(() => {
      setIsClient(true);
   }, []);

   const {
      loading: loadingRecipe,
      data: recipeData,
      fn: fetchRecipe,
   } = useFetch(getOrGenerateRecipe);

   const {
      loading: saving,
      data: saveData,
      fn: saveToCollection,
   } = useFetch(saveRecipeToCollection);

   const {
      loading: removing,
      data: removeData,
      fn: removeFromCollection,
   } = useFetch(removeRecipeFromCollection);

   useEffect(() => {
      if (!loadingRecipe) {
         setProgress(100);
         return;
      }

      setProgress(15);
      const interval = setInterval(() => {
         setProgress((prev) => {
            if (prev < 40) return prev + 8;
            if (prev < 70) return prev + 5;
            if (prev < 90) return prev + 2;
            if (prev < 96) return prev + 0.5;
            return prev;
         });
      }, 300);

      return () => clearInterval(interval);
   }, [loadingRecipe]);

   const lastFetchedRecipeRef = useRef<string | null>(null);
   const toastedRecipeRef = useRef<string | null>(null);

   useEffect(() => {
      if (!recipeName || lastFetchedRecipeRef.current === recipeName) return;

      lastFetchedRecipeRef.current = recipeName;
      const formData = new FormData();
      formData.append("recipeName", recipeName);
      fetchRecipe(formData);
   }, [recipeName, fetchRecipe]);

   useEffect(() => {
      const result = recipeData as RecipeResponse | undefined;

      if (!result?.success || !result.recipe) return;

      setRecipe(result.recipe);
      setRecipeId(result.recipeId ?? result.recipe.id ?? null);
      setIsSaved(Boolean(result.isSaved));

      const toastKey = `${result.recipeId ?? result.recipe.title}`;
      if (toastedRecipeRef.current !== toastKey) {
         toastedRecipeRef.current = toastKey;
         if (result.fromDatabase) {
            toast.success("Recipe loaded successfully", {
               id: "recipe-load-status",
            });
         } else {
            toast.success("Your recipe is ready!", {
               id: "recipe-load-status",
            });
         }
      }
   }, [recipeData]);

   useEffect(() => {
      const result = saveData as
         | { success?: boolean; alreadySaved?: boolean; message?: string }
         | undefined;

      if (!result?.success) return;

      if (result.alreadySaved) {
         setIsSaved(true);
         toast.info("Recipe is already in your collection");
      } else {
         setIsSaved(true);
         toast.success("Recipe saved to your collection!");
      }
   }, [saveData]);

   useEffect(() => {
      const result = removeData as
         | { success?: boolean; message?: string }
         | undefined;

      if (!result?.success) return;

      setIsSaved(false);
      toast.success("Recipe removed from your collection");
   }, [removeData]);

   const handleToggleSave = async () => {
      if (!recipeId) {
         toast.error("This recipe cannot be saved yet. Please try again.");
         return;
      }

      const formData = new FormData();
      formData.append("recipeId", recipeId);

      try {
         if (isSaved) {
            await removeFromCollection(formData);
         } else {
            await saveToCollection(formData);
         }
      } catch {
         toast.error("Something went wrong. Please try again.");
      }
   };

   if (!recipeName) {
      return (
         <div className="min-h-screen bg-[#fffdf8] px-4 pb-16 pt-12 text-stone-900 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl py-16 text-center">
               <AlertCircle className="mx-auto mb-5 h-12 w-12 text-[#d13228]" />

               <h2 className="mb-2 text-2xl font-bold text-stone-900">
                  No recipe selected
               </h2>

               <p className="mb-6 text-stone-600">
                  Choose a recipe to explore its ingredients and instructions.
               </p>

               <Button
                  onClick={() => router.push("/dashboard")}
                  className="bg-[#d13228] text-white hover:bg-[#b82921]"
               >
                  Explore Recipes
               </Button>
            </div>
         </div>
      );
   }

   if (loadingRecipe === null || loadingRecipe) {
      return (
         <div className="min-h-screen bg-[#fffdf8] px-4 pb-16 pt-12 text-stone-900 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl py-16 text-center">
               <ClockLoader
                  className="mx-auto mb-6"
                  color="#d13228"
                  size={55}
               />

               <h2 className="mb-2 text-3xl font-bold tracking-tight text-stone-900">
                  Preparing your recipe
               </h2>

               <p className="text-stone-600">
                  Our AI chef is putting together{" "}
                  <span className="font-semibold text-[#d13228]">
                     {recipeName}
                  </span>
                  ...
               </p>

               <div className="mx-auto mt-8 h-2 max-w-xs overflow-hidden rounded-full bg-stone-200">
                  <div
                     className="h-full rounded-full bg-gradient-to-r from-[#d13228] to-orange-400 transition-all duration-300 ease-out"
                     style={{ width: `${progress}%` }}
                  />
               </div>

               <p className="mt-3 text-xs font-medium text-stone-500">
                  {progress < 40
                     ? "Gathering and measuring ingredients..."
                     : progress < 75
                       ? "Writing detailed cooking instructions..."
                       : "Calculating nutrition and adding chef tips..."}
               </p>
            </div>
         </div>
      );
   }

   if (!recipe) {
      return (
         <div className="min-h-screen bg-[#fffdf8] px-4 pb-16 pt-12 text-stone-900 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl py-16 text-center">
               <AlertCircle className="mx-auto mb-5 h-12 w-12 text-red-600" />

               <h2 className="mb-2 text-2xl font-bold text-stone-900">
                  Couldn&apos;t load this recipe
               </h2>

               <p className="mb-6 text-stone-600">
                  {(recipeData as RecipeResponse | undefined)?.message ??
                     "Something went wrong while preparing your recipe. Please try again."}
               </p>

               <div className="flex flex-wrap justify-center gap-3">
                  <Button
                     variant="outline"
                     onClick={() => router.back()}
                     className="border-stone-300 text-stone-700 hover:bg-stone-100"
                  >
                     <ArrowLeft className="mr-2 h-4 w-4" />
                     Go back
                  </Button>

                  <Button
                     onClick={() => {
                        const formData = new FormData();
                        formData.append("recipeName", recipeName);
                        fetchRecipe(formData);
                     }}
                     className="bg-[#d13228] text-white hover:bg-[#b82921]"
                  >
                     Try again
                  </Button>
               </div>
            </div>
         </div>
      );
   }

   const totalTime =
      (Number.parseInt(String(recipe.prepTime), 10) || 0) +
      (Number.parseInt(String(recipe.cookTime), 10) || 0);

   const ingredientsByCategory = (recipe.ingredients ?? []).reduce<
      Record<string, Ingredient[]>
   >((groups, ingredient) => {
      const category = ingredient.category || "Other";

      if (!groups[category]) groups[category] = [];
      groups[category].push(ingredient);

      return groups;
   }, {});

   return (
      <div className="min-h-screen bg-[#fffdf8] px-4 pb-16 pt-12 text-stone-900 sm:px-6 lg:px-8">
         <div className="mx-auto max-w-6xl">
            <Link
               href="/dashboard"
               className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition-colors hover:text-[#d13228]"
            >
               <ArrowLeft className="h-4 w-4" />
               Back to recipes
            </Link>

            {/* Recipe overview */}
            <section className="mb-7 overflow-hidden rounded-2xl border border-stone-200 bg-white">
               {recipe.imageUrl && (
                  <div className="relative h-60 w-full bg-stone-100 sm:h-80 lg:h-[420px]">
                     <Image
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
                        className="object-cover"
                     />
                  </div>
               )}

               <div className="p-6 sm:p-9 lg:p-10">
                  <div className="mb-4 flex flex-wrap gap-2">
                     {recipe.cuisine && (
                        <Badge
                           variant="outline"
                           className="capitalize border-[#f0c4bd] bg-[#fff5f2] text-[#b82921]"
                        >
                           {capitalize(recipe.cuisine)}
                        </Badge>
                     )}

                     {recipe.category && (
                        <Badge
                           variant="outline"
                           className="capitalize border-stone-200 bg-stone-50 text-stone-600"
                        >
                           {capitalize(recipe.category)}
                        </Badge>
                     )}
                  </div>

                  <h1 className="mb-4 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
                     {recipe.title}
                  </h1>

                  {recipe.description && (
                     <p className="mb-7 max-w-3xl leading-7 text-stone-600">
                        {recipe.description}
                     </p>
                  )}

                  <div className="mb-7 flex flex-wrap gap-x-6 gap-y-4 text-sm text-stone-600">
                     <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-[#d13228]" />
                        <span>{totalTime} mins total</span>
                     </div>

                     <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-[#d13228]" />
                        <span>{recipe.servings} servings</span>
                     </div>

                     {recipe.nutrition?.calories != null && (
                        <div className="flex items-center gap-2">
                           <Flame className="h-5 w-5 text-[#d13228]" />
                           <span>{recipe.nutrition.calories} cal/serving</span>
                        </div>
                     )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                     <Button
                        onClick={handleToggleSave}
                        disabled={saving || removing || !recipeId}
                        className={
                           isSaved
                              ? "gap-2 bg-stone-100 text-stone-800 hover:bg-stone-200"
                              : "gap-2 bg-[#d13228] text-white hover:bg-[#b82921]"
                        }
                     >
                        {saving || removing ? (
                           <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isSaved ? (
                           <BookmarkCheck className="h-4 w-4" />
                        ) : (
                           <Bookmark className="h-4 w-4" />
                        )}

                        {saving
                           ? "Saving..."
                           : removing
                             ? "Removing..."
                             : isSaved
                               ? "Saved to collection"
                               : "Save recipe"}
                     </Button>

                     {isClient ? (
                        <PDFDownloadLink
                           document={<RecipePDF recipe={recipe} />}
                           fileName={`${recipe.title
                              .replace(/\s+/g, "-")
                              .toLowerCase()}.pdf`}
                        >
                           {({ loading }) => (
                              <Button
                                 variant="outline"
                                 disabled={loading}
                                 className="gap-2 border-stone-300 text-stone-700 hover:border-[#d13228] hover:bg-[#fff5f2] hover:text-[#b82921]"
                              >
                                 {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                 ) : (
                                    <Download className="h-4 w-4" />
                                 )}
                                 {loading ? "Preparing PDF..." : "Download PDF"}
                              </Button>
                           )}
                        </PDFDownloadLink>
                     ) : (
                        <Button
                           variant="outline"
                           disabled
                           className="gap-2 border-stone-300 text-stone-700 hover:border-[#d13228] hover:bg-[#fff5f2] hover:text-[#b82921]"
                        >
                           <Download className="h-4 w-4" />
                           Download PDF
                        </Button>
                     )}
                  </div>
               </div>
            </section>

            <div className="grid items-start gap-6 lg:grid-cols-3">
               {/* Ingredients, nutrition, tips, and substitutions */}
               <aside className="space-y-6 lg:col-span-1">
                  <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
                     <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-stone-900">
                        <ChefHat className="h-6 w-6 text-[#d13228]" />
                        Ingredients
                     </h2>

                     {Object.entries(ingredientsByCategory).map(
                        ([category, items]) => (
                           <div key={category} className="mb-6 last:mb-0">
                              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
                                 {category}
                              </h3>

                              <ul className="space-y-1">
                                 {items.map((ingredient, index) => (
                                    <li
                                       key={`${ingredient.item}-${index}`}
                                       className="flex items-start justify-between gap-3 border-b border-stone-100 py-3 text-sm last:border-0"
                                    >
                                       <span className="text-stone-700">
                                          {capitalize(ingredient.item)}
                                       </span>

                                       <span className="shrink-0 text-right font-semibold text-[#d13228]">
                                          {ingredient.amount}
                                       </span>
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        ),
                     )}

                     {recipe.nutrition && (
                        <div className="mt-6 border-t border-stone-200 pt-6">
                           <h3 className="mb-4 text-sm font-bold text-stone-900">
                              Nutrition per serving
                           </h3>

                           <div className="grid grid-cols-2 gap-3">
                              {(
                                 [
                                    [
                                       "Calories",
                                       recipe.nutrition.calories,
                                       true,
                                    ],
                                    [
                                       "Protein",
                                       recipe.nutrition.protein,
                                       false,
                                    ],
                                    ["Carbs", recipe.nutrition.carbs, false],
                                    ["Fat", recipe.nutrition.fat, false],
                                 ] as const
                              ).map(([label, value, highlighted]) => (
                                 <div
                                    key={label}
                                    className={`rounded-xl border p-3 text-center ${
                                       highlighted
                                          ? "border-[#f0c4bd] bg-[#fff5f2]"
                                          : "border-stone-100 bg-stone-50"
                                    }`}
                                 >
                                    <div
                                       className={`text-xl font-bold ${
                                          highlighted
                                             ? "text-[#d13228]"
                                             : "text-stone-900"
                                       }`}
                                    >
                                       {value ?? "—"}
                                    </div>
                                    <div className="mt-1 text-xs text-stone-500">
                                       {label}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                  </section>

                  {recipe.tips && recipe.tips.length > 0 && (
                     <section className="rounded-2xl border border-[#f0c4bd] bg-[#fff8f5] p-5 sm:p-6">
                        <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-stone-900">
                           <Lightbulb className="h-5 w-5 text-[#d13228]" />
                           Chef&apos;s tips and tricks
                        </h2>

                        <ul className="space-y-4">
                           {recipe.tips.map((tip, index) => (
                              <li
                                 key={`${tip}-${index}`}
                                 className="flex items-start gap-3 text-sm leading-6 text-stone-700"
                              >
                                 <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#d13228]" />
                                 <span>{tip}</span>
                              </li>
                           ))}
                        </ul>
                     </section>
                  )}

                  {recipe.substitutions && recipe.substitutions.length > 0 && (
                     <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
                        <h2 className="mb-3 text-xl font-bold text-stone-900">
                           Ingredient substitutions
                        </h2>

                        <p className="mb-6 text-sm leading-6 text-stone-600">
                           Missing an ingredient? Try one of these alternatives.
                        </p>

                        <div className="space-y-5">
                           {recipe.substitutions.map((sub, index) => (
                              <div
                                 key={`${sub.original}-${index}`}
                                 className="border-b border-stone-100 pb-5 last:border-0 last:pb-0"
                              >
                                 <h3 className="mb-3 font-semibold text-stone-900">
                                    Instead of{" "}
                                    <span className="text-[#d13228]">
                                       {capitalize(sub.original)}
                                    </span>
                                 </h3>

                                 <div className="flex flex-wrap gap-2">
                                    {sub.alternatives.map(
                                       (alternative, altIndex) => (
                                          <Badge
                                             key={`${alternative}-${altIndex}`}
                                             variant="outline"
                                             className="border-stone-200 bg-stone-50 font-normal text-stone-700"
                                          >
                                             {capitalize(alternative)}
                                          </Badge>
                                       ),
                                    )}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </section>
                  )}
               </aside>

               {/* Instructions and completion details */}
               <div className="space-y-6 lg:col-span-2">
                  <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
                     <h2 className="mb-7 text-2xl font-bold text-stone-900">
                        Step-by-step instructions
                     </h2>

                     <div>
                        {(recipe.instructions ?? []).map((step, index) => (
                           <div
                              key={`${step.step}-${index}`}
                              className={`relative ml-4 pb-8 pl-10 ${
                                 index !== recipe.instructions.length - 1
                                    ? "border-l-2 border-[#f0c4bd]"
                                    : ""
                              }`}
                           >
                              <div className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#d13228] text-sm font-bold text-white shadow-xs">
                                 {step.step || index + 1}
                              </div>

                              <h3 className="mb-2 text-lg font-semibold text-stone-900">
                                 {step.title}
                              </h3>

                              <p className="whitespace-pre-line leading-7 text-stone-600">
                                 {step.instruction}
                              </p>

                              {step.tip && (
                                 <div className="mt-4 rounded-xl border border-[#f0c4bd] bg-[#fff8f5] p-4">
                                    <p className="flex items-start gap-2 text-sm leading-6 text-stone-700">
                                       <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#d13228]" />
                                       <span>
                                          <strong className="text-stone-900">
                                             Chef&apos;s tip:{" "}
                                          </strong>
                                          {step.tip}
                                       </span>
                                    </p>
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>

                     <div className="mt-2 flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 p-5">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#d13228]" />
                        <div>
                           <h3 className="font-semibold text-stone-900">
                              Ready to serve
                           </h3>
                           <p className="mt-1 text-sm leading-6 text-stone-600">
                              Plate your creation and enjoy your {recipe.title}!
                           </p>
                        </div>
                     </div>
                  </section>
               </div>
            </div>
         </div>
      </div>
   );
}

export default function RecipePage() {
   return (
      <Suspense
         fallback={
            <div className="min-h-screen bg-[#fffdf8] px-4 pb-16 pt-12 text-stone-900 sm:px-6 lg:px-8">
               <div className="mx-auto max-w-3xl py-16 text-center">
                  <Loader2 className="mx-auto mb-5 h-10 w-10 animate-spin text-[#d13228]" />
                  <p className="text-stone-600">Loading recipe...</p>
               </div>
            </div>
         }
      >
         <RecipeContent />
      </Suspense>
   );
}
