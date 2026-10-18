import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
   title: "Servd - AI Recipes Platform",
   description: "AI-powered recipe assistant and meal planning",
   icons: {
      icon: "/logo.png",
   },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body className={`${inter.className}`}>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />
         </body>
      </html>
   );
}
