export { cn } from "cn";

export function capitalize(str?: string | null): string {
   if (!str) return "";
   const trimmed = String(str).trim();
   if (!trimmed) return "";
   return trimmed
      .split(/([\s-]+)/)
      .map((part) =>
         part.trim()
            ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            : part
      )
      .join("");
}
