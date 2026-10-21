import arcjet, { detectBot, shield } from "@arcjet/next";

export const aj = arcjet({
   key: process.env.ARCJET_KEY!,
   rules: [
      shield({ mode: "LIVE" }),
      detectBot({
         mode: "LIVE",
         allow: ["CATEGORY:SEARCH_ENGINE"],
      }),
   ],
});

// Unlimited pantry scans with baseline bot and abuse protection.
export const pantryScans = aj;
export const freePantryScans = aj;
