import Link from "next/link";
import Image from "next/image";
import { Clock, Users, ChefHat } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

type Recipe = {
   id?: string;
   idMeal?: string;
   strMeal?: string;
   strMealThumb?: string;
   title?: string;
   description?: string;
   category?: string;
   cuisine?: string;
   prepTime?: string | number;
   cookTime?: string | number;
   servings?: string | number;
   imageUrl?: string | null;
   matchPercentage?: number;
   missingIngredients?: string[];
   [key: string]: unknown;
};

type RecipeCardProps = {
   recipe: Recipe;
   variant?: "default" | "grid" | "pantry" | "list";
};

type RecipeCardData = {
   title: string;
   description?: string;
   category?: string;
   cuisine?: string;
   prepTime?: string | number;
   cookTime?: string | number;
   servings?: string | number;
   matchPercentage?: number;
   missingIngredients?: string[];
   image?: string | null;
   href: string;
   showImage: boolean;
};

type RecipeImageProps = {
   aspect?: string;
   image?: string | null;
   title: string;
   showImage?: boolean;
   showHoverOverlay?: boolean;
};

function RecipeImage({
   aspect = "aspect-square",
   image,
   title,
   showImage,
   showHoverOverlay = false,
}: RecipeImageProps) {
   return (
      <div className={`relative ${aspect} overflow-hidden`}>
         {showImage && image ? (
            <Image
               src={image}
               alt={title}
               fill
               className="object-cover transition-transform duration-500 group-hover:scale-105"
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
         ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#d13228]/80 to-orange-300">
               <ChefHat className="h-16 w-16 text-white/70" />
            </div>
         )}

         {showHoverOverlay && showImage && image && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
               <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-sm font-medium text-white">
                     Click to view recipe
                  </p>
               </div>
            </div>
         )}
      </div>
   );
}

export default function RecipeCard({
   recipe,
   variant = "default",
}: RecipeCardProps) {
   const getRecipeData = (): RecipeCardData => {
      if (recipe.strMeal) {
         return {
            title: recipe.strMeal,
            image: recipe.strMealThumb as string | undefined,
            href: `/recipe?cook=${encodeURIComponent(recipe.strMeal)}`,
            showImage: !!recipe.strMealThumb,
         };
      }

      if (recipe.matchPercentage !== undefined) {
         return {
            title: recipe.title || "Untitled Recipe",
            description: recipe.description,
            category: recipe.category,
            cuisine: recipe.cuisine,
            prepTime: recipe.prepTime,
            cookTime: recipe.cookTime,
            servings: recipe.servings,
            matchPercentage: recipe.matchPercentage,
            missingIngredients: recipe.missingIngredients || [],
            image: recipe.imageUrl,
            href: `/recipe?cook=${encodeURIComponent(recipe.title || "")}`,
            showImage: !!recipe.imageUrl,
         };
      }

      return {
         title: recipe.title || "Untitled Recipe",
         description: recipe.description,
         category: recipe.category,
         cuisine: recipe.cuisine,
         prepTime: recipe.prepTime,
         cookTime: recipe.cookTime,
         servings: recipe.servings,
         image: recipe.imageUrl,
         href: `/recipe?cook=${encodeURIComponent(recipe.title || "")}`,
         showImage: !!recipe.imageUrl,
      };
   };

   const data = getRecipeData();

   const totalMinutes =
      Number.parseInt(String(data.prepTime || 0), 10) +
      Number.parseInt(String(data.cookTime || 0), 10);

   const matchBadgeClass =
      (data.matchPercentage ?? 0) >= 90
         ? "bg-emerald-600"
         : (data.matchPercentage ?? 0) >= 75
           ? "bg-[#d13228]"
           : "bg-stone-600";

   // Grid variant — category and cuisine pages
   if (variant === "grid") {
      return (
         <Link href={data.href} className="group block h-full">
            <Card className="h-full overflow-hidden rounded-2xl border-stone-200 bg-white py-0 transition-all duration-300 hover:-translate-y-1 hover:border-[#d13228]/40 hover:shadow-xl">
               <RecipeImage
                  aspect="aspect-square"
                  image={data.image}
                  title={data.title}
                  showImage={data.showImage}
                  showHoverOverlay
               />

               <CardHeader className="p-4">
                  <CardTitle className="line-clamp-2 text-lg font-bold text-stone-900 transition-colors group-hover:text-[#d13228]">
                     {data.title}
                  </CardTitle>
               </CardHeader>
            </Card>
         </Link>
      );
   }

   // Pantry variant — AI-generated suggestions
   if (variant === "pantry") {
      return (
         <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-stone-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {data.showImage && (
               <div className="relative">
                  <RecipeImage
                     aspect="aspect-video"
                     image={data.image}
                     title={data.title}
                     showImage={data.showImage}
                  />

                  {data.matchPercentage !== undefined && (
                     <div className="absolute right-4 top-4">
                        <Badge
                           className={`${matchBadgeClass} px-3 py-1.5 text-base text-white shadow-lg`}
                        >
                           {data.matchPercentage}% Match
                        </Badge>
                     </div>
                  )}
               </div>
            )}

            <CardHeader>
               <div className="mb-2 flex flex-wrap gap-2">
                  {data.cuisine && (
                     <Badge
                        variant="outline"
                        className="border-[#d13228]/30 text-[#d13228] capitalize"
                     >
                        {data.cuisine}
                     </Badge>
                  )}

                  {data.category && (
                     <Badge
                        variant="outline"
                        className="border-stone-200 text-stone-600 capitalize"
                     >
                        {data.category}
                     </Badge>
                  )}

                  {!data.showImage && data.matchPercentage !== undefined && (
                     <Badge className={`${matchBadgeClass} text-white`}>
                        {data.matchPercentage}% Match
                     </Badge>
                  )}
               </div>

               <CardTitle className="text-2xl font-bold text-stone-900">
                  {data.title}
               </CardTitle>

               {data.description && (
                  <CardDescription className="mt-2 leading-relaxed text-stone-600">
                     {data.description}
                  </CardDescription>
               )}
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
               {(data.prepTime || data.cookTime || data.servings) && (
                  <div className="flex flex-wrap gap-4 text-sm text-stone-500">
                     {(data.prepTime || data.cookTime) && (
                        <div className="flex items-center gap-1">
                           <Clock className="h-4 w-4" />
                           <span>{totalMinutes} mins</span>
                        </div>
                     )}

                     {data.servings && (
                        <div className="flex items-center gap-1">
                           <Users className="h-4 w-4" />
                           <span>{data.servings} servings</span>
                        </div>
                     )}
                  </div>
               )}

               {!!data.missingIngredients?.length && (
                  <div className="rounded-xl border border-[#d13228]/15 bg-[#d13228]/5 p-4">
                     <h4 className="mb-2 text-sm font-semibold text-stone-900">
                        You&apos;ll need:
                     </h4>

                     <div className="flex flex-wrap gap-2">
                        {data.missingIngredients.map((ingredient, index) => (
                           <Badge
                              key={`${ingredient}-${index}`}
                              variant="outline"
                              className="border-stone-200 bg-white text-stone-700"
                           >
                              {ingredient}
                           </Badge>
                        ))}
                     </div>
                  </div>
               )}
            </CardContent>

            <CardFooter>
               <Button
                  render={<Link href={data.href} />}
                  className="w-full gap-2 rounded-full bg-[#d13228] text-white hover:bg-[#b92720]"
               >
                  <ChefHat className="h-4 w-4" />
                  View Full Recipe
               </Button>
            </CardFooter>
         </Card>
      );
   }

   // List variant — saved recipes and search results
   if (variant === "list") {
      return (
         <Link href={data.href} className="group block">
            <Card className="overflow-hidden rounded-2xl border-stone-200 bg-white py-0 transition-all hover:border-[#d13228]/30 hover:shadow-lg">
               <div className="flex flex-col sm:flex-row">
                  <div className="w-full shrink-0 sm:w-48">
                     <RecipeImage
                        aspect="aspect-video sm:aspect-square"
                        image={data.image}
                        title={data.title}
                        showImage={data.showImage}
                     />
                  </div>

                  <div className="min-w-0 flex-1 py-3">
                     <CardHeader>
                        <div className="mb-2 flex flex-wrap gap-2">
                           {data.cuisine && (
                              <Badge
                                 variant="outline"
                                 className="border-[#d13228]/30 text-[#d13228] capitalize"
                              >
                                 {data.cuisine}
                              </Badge>
                           )}

                           {data.category && (
                              <Badge
                                 variant="outline"
                                 className="border-stone-200 text-stone-600 capitalize"
                              >
                                 {data.category}
                              </Badge>
                           )}
                        </div>

                        <CardTitle className="text-xl font-bold text-stone-900 transition-colors group-hover:text-[#d13228]">
                           {data.title}
                        </CardTitle>

                        {data.description && (
                           <CardDescription className="line-clamp-2">
                              {data.description}
                           </CardDescription>
                        )}
                     </CardHeader>

                     {(data.prepTime || data.cookTime || data.servings) && (
                        <CardContent>
                           <div className="flex flex-wrap gap-4 pt-2 text-sm text-stone-500">
                              {(data.prepTime || data.cookTime) && (
                                 <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{totalMinutes} mins</span>
                                 </div>
                              )}

                              {data.servings && (
                                 <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>{data.servings} servings</span>
                                 </div>
                              )}
                           </div>
                        </CardContent>
                     )}
                  </div>
               </div>
            </Card>
         </Link>
      );
   }

   // Default variant
   return (
      <Link href={data.href} className="group block">
         <Card className="overflow-hidden rounded-2xl border-stone-200 bg-white py-0 transition-all hover:border-[#d13228]/30 hover:shadow-lg">
            {data.showImage && (
               <RecipeImage
                  aspect="aspect-video"
                  image={data.image}
                  title={data.title}
                  showImage={data.showImage}
               />
            )}

            <CardHeader className="p-5">
               <CardTitle className="text-lg font-bold text-stone-900 transition-colors group-hover:text-[#d13228]">
                  {data.title}
               </CardTitle>

               {data.description && (
                  <CardDescription className="line-clamp-2">
                     {data.description}
                  </CardDescription>
               )}
            </CardHeader>
         </Card>
      </Link>
   );
}
