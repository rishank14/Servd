"use client";

import { useState } from "react";
import { AuthModal } from "@/components/auth/auth-modal";

export default function Home() {
   const [authOpen, setAuthOpen] = useState(false);
   const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");

   function openAuth(mode: "sign-in" | "sign-up") {
      setAuthMode(mode);
      setAuthOpen(true);
   }

   return (
      <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-6 py-12">
         <section className="mx-auto flex max-w-4xl flex-col items-center justify-center text-center">
            <p className="mb-5 rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-semibold shadow-[3px_3px_0px_#000]">
               Your kitchen, upgraded.
            </p>

            <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-7xl">
               Good food.
               <br />
               <span className="text-[#d13228]">Less guesswork.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-gray-600">
               Discover recipes, find inspiration, and let AI help you decide
               what&apos;s cooking today.
            </p>

            <button
               onClick={() => openAuth("sign-up")}
               className="mt-8 rounded-xl border-[3px] border-black bg-[#d13228] px-8 py-4 text-lg font-bold text-white shadow-[5px_5px_0px_#000] transition hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
               Get cooking →
            </button>
         </section>

         <AuthModal
            open={authOpen}
            onOpenChange={setAuthOpen}
            mode={authMode}
            onModeChange={setAuthMode}
         />
      </div>
   );
}
