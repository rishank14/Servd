import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { Cookie, Refrigerator } from "lucide-react";

import { auth } from "@/lib/auth";
import HowToCookModal from "@/components/HowToCookModal";
import HeaderAuthActions from "@/components/HeaderAuthActions";
import UserDropdown from "@/components/UserDropdown";

export default async function Header() {
   const session = await auth.api.getSession({
      headers: await headers(),
   });

   const user = session?.user;

   return (
      <header className="fixed inset-x-0 top-0 z-50 border-b border-stone-200/80 bg-[#fffdf8]/90 backdrop-blur-xl">
         <nav className="relative mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
            {/* Logo */}
            <Link
               href={user ? "/dashboard" : "/"}
               aria-label="Servd home"
               className="group flex shrink-0 items-center"
            >
               <Image
                  src="/orange-logo.png"
                  alt="Servd"
                  width={120}
                  height={60}
                  priority
                  className="h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
               />
            </Link>

            {/* Center Navigation */}
            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 lg:gap-8 md:flex">
               <Link
                  href="/recipes"
                  className="group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-600 transition-colors hover:bg-orange-50 hover:text-[#d13228] lg:px-4"
               >
                  <Cookie className="h-[17px] w-[17px] transition-transform duration-200 group-hover:-rotate-12" />
                  My Recipes
               </Link>

               <Link
                  href="/pantry"
                  className="group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-600 transition-colors hover:bg-orange-50 hover:text-[#d13228] lg:px-4"
               >
                  <Refrigerator className="h-[17px] w-[17px] transition-transform duration-200 group-hover:-translate-y-0.5" />
                  My Pantry
               </Link>
            </div>

            {/* Right Actions */}
            <div className="flex shrink-0 items-center gap-3 sm:gap-4">
               <div className="hidden sm:block">
                  <HowToCookModal />
               </div>

               {user ? (
                  <UserDropdown />
               ) : (
                  <div className="flex items-center gap-3 sm:gap-4">
                     <HeaderAuthActions />
                  </div>
               )}
            </div>
         </nav>
      </header>
   );
}
