"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
   ChefHat,
   ChevronDown,
   Cookie,
   LogOut,
   Refrigerator,
   UserRound,
   X,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserDropdown() {
   const router = useRouter();
   const { data: session } = authClient.useSession();

   const [open, setOpen] = useState(false);
   const [isSigningOut, setIsSigningOut] = useState(false);

   const user = session?.user;
   const name = user?.name || "My Account";
   const email = user?.email || "";
   const image = user?.image;

   async function handleSignOut() {
      if (isSigningOut) return;

      setIsSigningOut(true);

      try {
         const result = await authClient.signOut();

         if (result.error) {
            toast.error(result.error.message || "Unable to sign out.");
            return;
         }

         setOpen(false);
         toast.success("Signed out successfully.");
         router.replace("/");
         router.refresh();
      } catch {
         toast.error("Something went wrong. Please try again.");
      } finally {
         setIsSigningOut(false);
      }
   }

   return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
         <DropdownMenuTrigger
            className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d13228]/30 ${
               open
                  ? "border-stone-300 bg-transparent text-stone-900"
                  : "border-stone-200 bg-transparent text-stone-700 hover:border-stone-300 hover:text-[#d13228]"
            }`}
         >
            {image ? (
               <Image
                  src={image}
                  alt=""
                  width={28}
                  height={28}
                  unoptimized
                  referrerPolicy="no-referrer"
                  className="h-7 w-7 shrink-0 rounded-full border border-stone-200 object-cover"
               />
            ) : (
               <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-stone-200 text-stone-600">
                  <UserRound className="h-4 w-4" />
               </span>
            )}

            <span className="max-w-40 truncate">{name}</span>

            {open ? (
               <X className="h-4 w-4 shrink-0 text-stone-500" />
            ) : (
               <ChevronDown className="h-4 w-4 shrink-0 text-stone-400" />
            )}
         </DropdownMenuTrigger>

         <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-64 rounded-xl border border-stone-200 bg-[#fffdf8] p-2 text-stone-800 shadow-lg"
         >
            <DropdownMenuGroup>
               <DropdownMenuLabel className="px-3 py-3 font-normal">
                  <div className="flex items-center gap-3">
                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white">
                        <ChefHat className="h-5 w-5 text-[#d13228]" />
                     </div>

                     <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-stone-900">
                           {name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-stone-500">
                           {email}
                        </p>
                     </div>
                  </div>
               </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-stone-200" />

            <DropdownMenuGroup>
               <DropdownMenuItem
                  onClick={() => {
                     setOpen(false);
                     router.push("/recipes");
                  }}
                  className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 focus:bg-orange-50 focus:text-[#d13228]"
               >
                  <Cookie className="h-4 w-4" />
                  My Recipes
               </DropdownMenuItem>

               <DropdownMenuItem
                  onClick={() => {
                     setOpen(false);
                     router.push("/pantry");
                  }}
                  className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 focus:bg-orange-50 focus:text-[#d13228]"
               >
                  <Refrigerator className="h-4 w-4" />
                  My Pantry
               </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-stone-200" />

            <DropdownMenuItem
               disabled={isSigningOut}
               onClick={() => void handleSignOut()}
               className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#d13228] focus:bg-orange-50 focus:text-[#d13228]"
            >
               <LogOut className="h-4 w-4" />
               {isSigningOut ? "Signing out..." : "Sign out"}
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
