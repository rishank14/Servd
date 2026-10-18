"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type AuthMode = "sign-in" | "sign-up";

type AuthModalProps = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   mode: AuthMode;
   onModeChange: (mode: AuthMode) => void;
};

export function AuthModal({
   open,
   onOpenChange,
   mode,
   onModeChange,
}: AuthModalProps) {
   const router = useRouter();

   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);

   function switchMode(nextMode: AuthMode) {
      onModeChange(nextMode);
      setPassword("");
      setShowPassword(false);
   }

   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setLoading(true);

      try {
         if (mode === "sign-in") {
            const result = await authClient.signIn.email({
               email,
               password,
            });

            if (result.error) {
               toast.error(result.error.message || "Unable to sign in.");
               return;
            }
         } else {
            const result = await authClient.signUp.email({
               name,
               email,
               password,
            });

            if (result.error) {
               toast.error(result.error.message || "Unable to create account.");
               return;
            }
         }

         toast.success(
            mode === "sign-in"
               ? "Welcome back!"
               : "Your Servd account has been created!",
         );

         onOpenChange(false);
         router.refresh();
      } catch {
         toast.error("Something went wrong. Please try again.");
      } finally {
         setLoading(false);
      }
   }

   async function handleGoogleSignIn() {
      setLoading(true);

      try {
         const result = await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
         });

         if (result.error) {
            toast.error(result.error.message || "Google sign-in failed.");
            setLoading(false);
         }
      } catch {
         toast.error("Could not start Google sign-in.");
         setLoading(false);
      }
   }

   const inputClassName = `${
      mode === "sign-up" ? "h-10" : "h-12"
   } w-full rounded-xl border-[3px] border-black bg-white px-4 text-sm outline-none transition focus:ring-2 focus:ring-red-500 disabled:opacity-60`;

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent
            showCloseButton
            className="w-[calc(100vw-24px)] max-h-[calc(100dvh-24px)] overflow-y-auto rounded-[18px] border-[3px] border-black bg-white p-0 text-[#25252b] shadow-[8px_8px_0px_#000] sm:w-full sm:max-w-[520px]"
         >
            <div
               className={
                  mode === "sign-up"
                     ? "px-5 pb-3 pt-5 sm:px-8 sm:pb-4 sm:pt-6"
                     : "px-5 pb-5 pt-7 sm:px-8 sm:pb-6 sm:pt-8"
               }
            >
               <DialogHeader className="text-center sm:text-center">
                  <DialogTitle className="text-2xl font-bold tracking-tight text-[#25252b] sm:text-3xl">
                     {mode === "sign-in"
                        ? "Sign in to Servd"
                        : "Create your Servd account"}
                  </DialogTitle>

                  <DialogDescription className="mt-2 text-sm text-[#55555d] sm:text-base">
                     {mode === "sign-in"
                        ? "Welcome back! Let's get cooking."
                        : "Join Servd and discover your next favourite recipe."}
                  </DialogDescription>
               </DialogHeader>

               <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="mt-5 flex h-12 w-full items-center justify-center gap-3 rounded-xl border-[3px] border-black bg-white font-semibold shadow-[4px_4px_0px_#000] transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
               >
                  <Image
                     src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                     alt=""
                     width={22}
                     height={22}
                     unoptimized
                  />
                  Continue with Google
               </button>

               <div className="my-4 flex items-center gap-4">
                  <div className="h-px flex-1 bg-black" />
                  <span className="text-sm font-semibold">or</span>
                  <div className="h-px flex-1 bg-black" />
               </div>

               <form
                  onSubmit={handleSubmit}
                  className={mode === "sign-up" ? "space-y-2" : "space-y-3"}
               >
                  {mode === "sign-up" && (
                     <div>
                        <label
                           htmlFor="auth-name"
                           className="mb-1.5 block text-sm font-semibold"
                        >
                           Full name
                        </label>

                        <input
                           id="auth-name"
                           type="text"
                           autoComplete="name"
                           placeholder="Your name"
                           value={name}
                           onChange={(event) => setName(event.target.value)}
                           required
                           minLength={2}
                           disabled={loading}
                           className={inputClassName}
                        />
                     </div>
                  )}

                  <div>
                     <label
                        htmlFor="auth-email"
                        className="mb-1.5 block text-sm font-semibold"
                     >
                        Email address
                     </label>

                     <input
                        id="auth-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        disabled={loading}
                        className={inputClassName}
                     />
                  </div>

                  <div>
                     <label
                        htmlFor="auth-password"
                        className="mb-1.5 block text-sm font-semibold"
                     >
                        Password
                     </label>

                     <div className="relative">
                        <input
                           id="auth-password"
                           type={showPassword ? "text" : "password"}
                           autoComplete={
                              mode === "sign-in"
                                 ? "current-password"
                                 : "new-password"
                           }
                           placeholder="Enter your password"
                           value={password}
                           onChange={(event) => setPassword(event.target.value)}
                           required
                           minLength={mode === "sign-up" ? 8 : undefined}
                           disabled={loading}
                           className={`${inputClassName} pr-12`}
                        />

                        <button
                           type="button"
                           onClick={() =>
                              setShowPassword((previous) => !previous)
                           }
                           disabled={loading}
                           aria-label={
                              showPassword ? "Hide password" : "Show password"
                           }
                           aria-pressed={showPassword}
                           className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-600 transition hover:text-black disabled:opacity-50"
                        >
                           {showPassword ? (
                              <EyeOff size={20} strokeWidth={2} />
                           ) : (
                              <Eye size={20} strokeWidth={2} />
                           )}
                        </button>
                     </div>

                     {mode === "sign-up" && (
                        <p className="mt-1 text-xs text-[#666]">
                           Use at least 8 characters.
                        </p>
                     )}
                  </div>

                  <button
                     type="submit"
                     disabled={loading}
                     className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border-[3px] border-black bg-[#d13228] px-4 font-bold text-white shadow-[4px_4px_0px_#000] transition-transform hover:-translate-y-0.5 hover:bg-[#b92820] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
                  >
                     {loading ? (
                        <>
                           <LoaderCircle
                              size={18}
                              strokeWidth={2.5}
                              className="animate-spin"
                              aria-hidden="true"
                           />
                           <span>Please wait...</span>
                        </>
                     ) : (
                        <>
                           <span>
                              {mode === "sign-in"
                                 ? "Continue"
                                 : "Create account"}
                           </span>
                           <ArrowRight
                              size={18}
                              strokeWidth={2.5}
                              aria-hidden="true"
                           />
                        </>
                     )}
                  </button>
               </form>
            </div>

            <div className="border-t border-gray-200 px-4 py-3 text-center">
               <p className="text-sm">
                  {mode === "sign-in"
                     ? "Don't have an account?"
                     : "Already have an account?"}{" "}
                  <button
                     type="button"
                     disabled={loading}
                     onClick={() =>
                        switchMode(mode === "sign-in" ? "sign-up" : "sign-in")
                     }
                     className="font-bold text-[#d13228] underline decoration-[2px] underline-offset-4 hover:text-[#a9221b] disabled:opacity-50"
                  >
                     {mode === "sign-in" ? "Sign up" : "Sign in"}
                  </button>
               </p>
            </div>

            <div className="border-t border-gray-200 px-4 py-3 text-center text-xs font-medium text-[#55555d]">
               Made for food lovers. Powered by Servd.
            </div>
         </DialogContent>
      </Dialog>
   );
}
