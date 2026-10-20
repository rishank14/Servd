import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Flame, Clock, Users } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

import { SITE_STATS, FEATURES, HOW_IT_WORKS_STEPS } from "@/lib/data";

export default function LandingPage() {
   return (
      <div className="min-h-screen bg-[#fffdf8] text-stone-900">
         {/* Hero Section */}
         <section className="flex min-h-[calc(100vh-72px)] flex-col justify-center px-4 py-8 md:py-12">
            <div className="mx-auto w-full max-w-6xl">
               <div className="flex flex-col items-center gap-12 md:flex-row md:gap-20">
                  {/* Text Content */}
                  <div className="flex-1 text-center md:text-left">
                     <Badge
                        variant="outline"
                        className="mb-6 border-2 border-[#d13228] bg-[#d13228]/5 text-sm font-bold uppercase tracking-wide text-[#d13228]"
                     >
                        <Flame className="mr-1 h-4 w-4" />
                        #1 AI Cooking Assistant
                     </Badge>

                     <h1 className="mb-6 text-6xl font-bold leading-[0.9] tracking-tight md:text-8xl">
                        Turn your{" "}
                        <span className="italic underline decoration-[#d13228] decoration-4">
                           leftovers
                        </span>{" "}
                        into <br />
                        masterpieces.
                     </h1>

                     <p className="mx-auto mb-10 max-w-lg text-xl font-light text-stone-600 md:mx-0 md:text-2xl">
                        Snap a photo of your fridge. We&apos;ll tell you what to
                        cook. Save money, reduce waste, and eat better tonight.
                     </p>

                     <Link
                        href="/dashboard"
                        className={cn(
                           buttonVariants({ variant: "primary", size: "xl" }),
                           "inline-flex items-center px-8 py-6 text-lg",
                        )}
                     >
                        Start Cooking Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                     </Link>

                     <p className="mt-6 text-sm text-stone-500">
                        <span className="font-bold text-stone-900">
                           10k+ cooks
                        </span>{" "}
                        joined last month
                     </p>
                  </div>

                  {/* Hero Image */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-3xl border-4 border-stone-900 bg-stone-200 md:aspect-[4/5] md:flex-1">
                     <Image
                        src="/pasta-dish.png"
                        alt="Delicious pasta dish"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                     />

                     {/* Floating Recipe Card */}
                     <Card className="absolute bottom-6 left-4 right-4 border-2 border-stone-900 bg-white/95 p-0 backdrop-blur-sm sm:bottom-8 sm:left-8 sm:right-8">
                        <CardContent className="p-4">
                           <div className="mb-2 flex items-start justify-between gap-3">
                              <div>
                                 <h3 className="text-lg font-bold">
                                    Rustic Tomato Basil Pasta
                                 </h3>

                                 <div className="mt-1 flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                       <Star
                                          key={`star-${i}`}
                                          className="h-3 w-3 fill-[#d13228] text-[#d13228]"
                                       />
                                    ))}
                                 </div>
                              </div>

                              <Badge
                                 variant="outline"
                                 className="shrink-0 border-2 border-[#d13228] bg-[#d13228]/5 font-bold text-[#d13228]"
                              >
                                 98% MATCH
                              </Badge>
                           </div>

                           <div className="flex flex-wrap gap-4 text-xs font-medium text-stone-500">
                              <span className="flex items-center gap-1">
                                 <Clock className="h-3 w-3" />
                                 25 mins
                              </span>

                              <span className="flex items-center gap-1">
                                 <Users className="h-3 w-3" />2 servings
                              </span>
                           </div>
                        </CardContent>
                     </Card>
                  </div>
               </div>
            </div>
         </section>

         {/* Stats Bar */}
         <section className="border-y-2 border-stone-900 bg-stone-900 py-12">
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 text-center md:grid-cols-4">
               {SITE_STATS.map((stat) => (
                  <div key={stat.label}>
                     <div className="mb-1 text-4xl font-bold text-stone-50">
                        {stat.val}
                     </div>

                     <p className="text-sm font-medium uppercase tracking-wider text-[#f07870]">
                        {stat.label}
                     </p>
                  </div>
               ))}
            </div>
         </section>

         {/* Features */}
         <section className="px-4 py-24">
            <div className="mx-auto max-w-6xl">
               <div className="mb-16">
                  <h2 className="mb-4 text-5xl font-bold md:text-6xl">
                     Your Smart Kitchen
                  </h2>

                  <p className="text-xl font-light text-stone-600">
                     Everything you need to master your meal prep.
                  </p>
               </div>

               <div className="grid gap-6 md:grid-cols-2">
                  {FEATURES.map((feature) => {
                     const IconComponent = feature.icon;

                     return (
                        <Card
                           key={feature.title}
                           className="group border-2 border-stone-200 bg-white p-0 transition-all hover:border-[#d13228] hover:shadow-lg"
                        >
                           <CardContent className="p-8">
                              <div className="mb-6 flex items-start justify-between">
                                 <div className="rounded-xl border-2 border-stone-200 bg-[#d13228]/5 p-3 transition-colors group-hover:border-[#d13228] group-hover:bg-[#d13228]/10">
                                    <IconComponent className="h-6 w-6" />
                                 </div>

                                 <span className="rounded-full border border-[#d13228]/20 bg-[#d13228]/5 px-3 py-1.5 text-xs font-medium text-[#d13228]">
                                    {feature.limit}
                                 </span>
                              </div>

                              <h3 className="mb-3 text-2xl font-bold">
                                 {feature.title}
                              </h3>

                              <p className="text-lg font-light text-stone-600">
                                 {feature.description}
                              </p>
                           </CardContent>
                        </Card>
                     );
                  })}
               </div>
            </div>
         </section>

         {/* How It Works */}
         <section className="border-y-2 border-stone-200 bg-stone-900 px-4 py-24 text-stone-50">
            <div className="mx-auto max-w-5xl">
               <h2 className="mb-16 text-5xl font-bold md:text-6xl">
                  Cook in 3 Steps
               </h2>

               <div className="space-y-12">
                  {HOW_IT_WORKS_STEPS.map((item, i) => (
                     <div key={item.step}>
                        <div className="flex items-start gap-6">
                           <span className="text-6xl font-bold leading-none text-[#f07870]">
                              {item.step}
                           </span>

                           <div>
                              <h3 className="mb-3 text-2xl font-bold">
                                 {item.title}
                              </h3>

                              <p className="text-lg font-light text-stone-400">
                                 {item.desc}
                              </p>
                           </div>
                        </div>

                        {i < HOW_IT_WORKS_STEPS.length - 1 && (
                           <hr className="my-8 border-stone-700" />
                        )}
                     </div>
                  ))}
               </div>
            </div>
         </section>
      </div>
   );
}
