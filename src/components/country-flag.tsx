import { countryCodeMap } from "@/lib/data";

type CountryFlagProps = {
   area: string;
   className?: string;
};

export default function CountryFlag({
   area,
   className = "",
}: CountryFlagProps) {
   const code = countryCodeMap[area];

   if (!code) {
      return (
         <span
            className={`inline-flex h-[30px] w-10 items-center justify-center ${className}`}
            role="img"
            aria-label={`${area} flag unavailable`}
         >
            🌍
         </span>
      );
   }

   return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
         src={`https://flagcdn.com/w80/${code}.png`}
         alt={`${area} flag`}
         width={40}
         height={30}
         className={`h-[30px] w-10 shrink-0 rounded-sm object-cover ${className}`}
         loading="lazy"
      />
   );
}
