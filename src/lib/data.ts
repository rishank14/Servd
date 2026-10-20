
import { Camera, BookOpen, ChefHat, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const SITE_STATS = [
   { label: "Your Kitchen", val: "One Place" },
   { label: "Recipe Ideas", val: "Endless" },
   { label: "Time to Cook", val: "Less Fuss" },
   { label: "Food Waste", val: "Smarter" },
];

type Feature = {
   title: string;
   description: string;
   icon: LucideIcon;
   limit: string;
};

export const FEATURES: Feature[] = [
   {
      title: "Scan Your Pantry",
      description:
         "Photo recognition that actually works. Know what you have instantly.",
      icon: Camera,
      limit: "Know your ingredients",
   },
   {
      title: "AI Chef Suggestions",
      description:
         "Turn random ingredients into a gourmet meal. Zero food waste.",
      icon: ChefHat,
      limit: "Ideas made for you",
   },
   {
      title: "Search Any Dish",
      description:
         "Find any recipe instantly. Filter by cuisine, time, or dietary needs.",
      icon: Search,
      limit: "Find your next favourite",
   },
   {
      title: "Digital Cookbook",
      description: "Save your favorites. Export as PDF. Share with family.",
      icon: BookOpen,
      limit: "Keep recipes close",
   },
];

type HowItWorksStep = {
   step: string;
   title: string;
   desc: string;
};

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
   {
      step: "01",
      title: "Scan",
      desc: "Point camera at fridge. AI identifies ingredients.",
   },
   {
      step: "02",
      title: "Select",
      desc: "Choose a generated recipe based on your mood.",
   },
   {
      step: "03",
      title: "Savor",
      desc: "Follow simple steps. Eat delicious food.",
   },
];

// Featured cuisines from TheMealDB API.
// Keep the API's exact area names here.
export const FEATURED_AREAS = [
   "American",
   "British",
   "Canadian",
   "Chinese",
   "Croatian",
   "Dutch",
   "Egyptian",
   "Filipino",
   "French",
   "Greek",
   "Indian",
   "Irish",
   "Italian",
   "Jamaican",
   "Japanese",
   "Kenyan",
   "Malaysian",
   "Mexican",
   "Moroccan",
   "Polish",
   "Portuguese",
   "Russian",
   "Spanish",
   "Thai",
   "Tunisian",
   "Turkish",
   "Ukrainian",
   "Vietnamese",
   "Algerian",
   "Argentine",
   "Australian",
   "Norwegian",
   "Saudi Arabian",
   "Syrian",
   "Uruguayan",
   "Venezuelan",
   "Slovak",
] as const;

// Category emojis
const categoryEmojiMap: Record<string, string> = {
   Beef: "🥩",
   Chicken: "🍗",
   Dessert: "🍰",
   Lamb: "🍖",
   Miscellaneous: "🍴",
   Pasta: "🍝",
   Pork: "🥓",
   Seafood: "🦐",
   Side: "🥗",
   Starter: "🥟",
   Vegan: "🥬",
   Vegetarian: "🥕",
   Breakfast: "🍳",
   Goat: "🐐",
};

export function getCategoryEmoji(category: string): string {
   return categoryEmojiMap[category] ?? "🍽️";
}

// Country codes for FlagCDN.
// Keys match TheMealDB API area names exactly.
export const countryCodeMap: Record<string, string> = {
   American: "us",
   British: "gb",
   Canadian: "ca",
   Chinese: "cn",
   Croatian: "hr",
   Dutch: "nl",
   Egyptian: "eg",
   Filipino: "ph",
   French: "fr",
   Greek: "gr",
   Indian: "in",
   Irish: "ie",
   Italian: "it",
   Jamaican: "jm",
   Japanese: "jp",
   Kenyan: "ke",
   Malaysian: "my",
   Mexican: "mx",
   Moroccan: "ma",
   Polish: "pl",
   Portuguese: "pt",
   Russian: "ru",
   Spanish: "es",
   Thai: "th",
   Tunisian: "tn",
   Turkish: "tr",
   Ukrainian: "ua",
   Vietnamese: "vn",
   Algerian: "dz",
   Argentine: "ar",
   Australian: "au",
   Norwegian: "no",
   "Saudi Arabian": "sa",
   Syrian: "sy",
   Uruguayan: "uy",
   Venezuelan: "ve",
   Slovak: "sk",
};

const countryFlagMap: Record<string, string> = {
   American: "🇺🇸",
   British: "🇬🇧",
   Canadian: "🇨🇦",
   Chinese: "🇨🇳",
   Croatian: "🇭🇷",
   Dutch: "🇳🇱",
   Egyptian: "🇪🇬",
   Filipino: "🇵🇭",
   French: "🇫🇷",
   Greek: "🇬🇷",
   Indian: "🇮🇳",
   Irish: "🇮🇪",
   Italian: "🇮🇹",
   Jamaican: "🇯🇲",
   Japanese: "🇯🇵",
   Kenyan: "🇰🇪",
   Malaysian: "🇲🇾",
   Mexican: "🇲🇽",
   Moroccan: "🇲🇦",
   Polish: "🇵🇱",
   Portuguese: "🇵🇹",
   Russian: "🇷🇺",
   Spanish: "🇪🇸",
   Thai: "🇹🇭",
   Tunisian: "🇹🇳",
   Turkish: "🇹🇷",
   Ukrainian: "🇺🇦",
   Vietnamese: "🇻🇳",
   Algerian: "🇩🇿",
   Argentine: "🇦🇷",
   Australian: "🇦🇺",
   Norwegian: "🇳🇴",
   "Saudi Arabian": "🇸🇦",
   Syrian: "🇸🇾",
   Uruguayan: "🇺🇾",
   Venezuelan: "🇻🇪",
   Slovak: "🇸🇰",
};

export function getCountryFlag(country: string): string {
   return countryFlagMap[country] ?? "🌍";
}
