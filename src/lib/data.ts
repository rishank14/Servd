
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

// Helper function for category emojis
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

// Helper function for country flags
const countryFlagMap: Record<string, string> = {
   American: "🗽",
   British: "👑",
   Canadian: "🍁",
   Chinese: "🐉",
   Croatian: "⚽",
   Dutch: "🌷",
   Egyptian: "🐫",
   Filipino: "🌴",
   French: "🥐",
   Greek: "🏛️",
   Indian: "🪷",
   Irish: "☘️",
   Italian: "🍕",
   Jamaican: "🌴",
   Japanese: "🗾",
   Kenyan: "🦒",
   Malaysian: "🌺",
   Mexican: "🌮",
   Moroccan: "🕌",
   Polish: "🦅",
   Portuguese: "🚢",
   Russian: "❄️",
   Spanish: "💃",
   Thai: "🛕",
   Tunisian: "🏜️",
   Turkish: "🧿",
   Ukrainian: "🌻",
   Vietnamese: "🍜",
   Algerian: "🏜️",
   Argentinian: "⚽",
   Australian: "🦘",
   Norwegian: "❄️",
   "Saudi Arabian": "🕋",
   Slovakian: "🏔️",
   Syrian: "🏛️",
   Uruguayan: "⚽",
   Venezuelan: "🌞",
};

export function getCountryFlag(country: string): string {
   return countryFlagMap[country] ?? "🌍";
}
