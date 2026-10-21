import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import Image from "next/image";
import Link from "next/link";

import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
   title: "Servd - AI Recipes Platform",
   description: "AI-powered recipe assistant and meal planning",
   icons: {
      icon: "/orange-logo.png",
      shortcut: "/orange-logo.png",
      apple: "/orange-logo.png",
   },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body className={`${inter.className} bg-[#fffdf8] text-stone-900`}>
            <Header />

            <main className="min-h-[calc(100vh-72px)]">{children}</main>

            <Toaster richColors />

            {/* Footer */}
            <footer className="border-t border-stone-200 bg-[#fffdf8] px-4 py-10">
               <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
                  {/* Brand */}
                  <Link href="/" className="flex items-center gap-3">
                     <Image
                        src="/logo.png"
                        alt="Servd Logo"
                        width={44}
                        height={44}
                        className="h-11 w-11 object-contain"
                     />

                     <div>
                        <p className="text-xl font-bold tracking-tight">
                           Servd
                        </p>
                        <p className="text-sm text-stone-500">
                           Good food starts here.
                        </p>
                     </div>
                  </Link>

                  {/* Tagline */}
                  <p className="text-center text-sm text-stone-500 sm:text-right">
                     Made by{" "}
                     <span className="font-semibold text-stone-800">
                        Rishank Kalra
                     </span>
                     <span className="mt-1 block text-xs text-stone-400">
                        © {new Date().getFullYear()} Servd.
                     </span>
                  </p>
               </div>
            </footer>
         </body>
      </html>
   );
}
