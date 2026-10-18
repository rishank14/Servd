"use client";

import { useState } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";

type AuthMode = "sign-in" | "sign-up";

export default function HeaderAuthActions() {
   const [authOpen, setAuthOpen] = useState(false);
   const [authMode, setAuthMode] = useState<AuthMode>("sign-in");

   function openAuth(mode: AuthMode) {
      setAuthMode(mode);
      setAuthOpen(true);
   }

   return (
      <>
         <Button
            variant="ghost"
            onClick={() => openAuth("sign-in")}
            className="font-medium text-stone-600 hover:bg-orange-50 hover:text-orange-600"
         >
            Sign In
         </Button>

         <Button
            onClick={() => openAuth("sign-up")}
            className="rounded-full bg-[#d13228] px-6 font-semibold text-white hover:bg-[#b92820]"
         >
            Get Started
         </Button>

         <AuthModal
            open={authOpen}
            onOpenChange={setAuthOpen}
            mode={authMode}
            onModeChange={setAuthMode}
         />
      </>
   );
}
