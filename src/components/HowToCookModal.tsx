"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChefHat, Search, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";

const recipeExamples = ["Butter Chicken", "Chocolate Brownies", "Paneer Tikka"];

export default function HowToCookModal() {
   const router = useRouter();
   const [recipeName, setRecipeName] = useState("");
   const [isOpen, setIsOpen] = useState(false);

   function handleOpenChange(open: boolean) {
      setIsOpen(open);

      if (!open) {
         setRecipeName("");
      }
   }

   function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const trimmedRecipeName = recipeName.trim();

      if (!trimmedRecipeName) {
         toast.error("Please enter a recipe name.");
         return;
      }

      handleOpenChange(false);

      router.push(`/recipe?cook=${encodeURIComponent(trimmedRecipeName)}`);
   }

   return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
         <DialogTrigger
            type="button"
            className="group inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-600 transition-colors hover:bg-orange-50 hover:text-[#d13228]"
         >
            <ChefHat className="h-[17px] w-[17px] transition-transform duration-200 group-hover:-rotate-6" />
            <span>How to Cook?</span>
         </DialogTrigger>

         <DialogContent className="max-h-[calc(100dvh-24px)] w-[calc(100vw-24px)] max-w-[520px] overflow-y-auto rounded-[20px] border-2 border-black bg-[#fffdf8] p-5 text-stone-900 shadow-[7px_7px_0px_#000] sm:p-7">
            <DialogHeader className="space-y-3 text-left">
               <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0px_#000]">
                  <ChefHat className="h-6 w-6 text-[#d13228]" />
               </div>

               <DialogTitle className="text-2xl font-black tracking-tight sm:text-3xl">
                  What are we cooking?
               </DialogTitle>

               <DialogDescription className="max-w-md text-sm leading-6 text-stone-600 sm:text-base">
                  Tell us what you&apos;re craving. Your AI cooking assistant
                  will help you figure out how to make it.
               </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
               {/* Recipe input */}
               <div className="space-y-2">
                  <label
                     htmlFor="recipe-name"
                     className="text-sm font-bold text-stone-800"
                  >
                     Recipe name
                  </label>

                  <div className="relative">
                     <Search
                        aria-hidden="true"
                        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
                     />

                     <input
                        id="recipe-name"
                        type="text"
                        value={recipeName}
                        onChange={(event) => setRecipeName(event.target.value)}
                        placeholder="e.g. Chicken Biryani"
                        autoComplete="off"
                        maxLength={120}
                        className="h-12 w-full rounded-xl border-2 border-stone-200 bg-white pl-11 pr-11 text-sm font-medium text-stone-900 outline-none transition placeholder:font-normal placeholder:text-stone-400 focus:border-[#d13228] focus:ring-2 focus:ring-[#d13228]/10"
                     />

                     {recipeName && (
                        <button
                           type="button"
                           onClick={() => setRecipeName("")}
                           aria-label="Clear recipe name"
                           className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
                        >
                           <X className="h-4 w-4" />
                        </button>
                     )}
                  </div>
               </div>

               {/* Suggested recipes */}
               <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4">
                  <div className="flex items-center gap-2">
                     <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d13228]/10">
                        <SparklesIcon />
                     </span>

                     <div>
                        <p className="text-sm font-bold text-stone-900">
                           Need some inspiration?
                        </p>
                        <p className="text-xs text-stone-500">
                           Pick something to get started.
                        </p>
                     </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                     {recipeExamples.map((example) => {
                        const isSelected = recipeName === example;

                        return (
                           <button
                              key={example}
                              type="button"
                              onClick={() => setRecipeName(example)}
                              aria-pressed={isSelected}
                              className={`rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                                 isSelected
                                    ? "border-[#d13228] bg-[#d13228]/5 text-[#d13228]"
                                    : "border-stone-200 bg-[#fffdf8] text-stone-600 hover:border-[#d13228]/50 hover:text-[#d13228]"
                              }`}
                           >
                              {example}
                           </button>
                        );
                     })}
                  </div>
               </div>

               {/* Submit */}
               <Button
                  type="submit"
                  disabled={!recipeName.trim()}
                  className="h-12 w-full rounded-xl border-2 border-black bg-[#d13228] text-base font-bold text-white shadow-[3px_3px_0px_#000] transition hover:-translate-y-0.5 hover:bg-[#b92820] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
               >
                  <ChefHat className="mr-2 h-5 w-5" />
                  Let&apos;s Cook
                  <ArrowRight className="ml-1 h-4 w-4" />
               </Button>

               <p className="text-center text-xs text-stone-500">
                  Made for food lovers. Powered by Servd.
               </p>
            </form>
         </DialogContent>
      </Dialog>
   );
}

function SparklesIcon() {
   return <ChefHat aria-hidden="true" className="h-4 w-4 text-[#d13228]" />;
}
