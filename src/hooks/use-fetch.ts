"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

type UseFetchReturn<T, Args extends unknown[]> = {
   data: T | undefined;
   loading: boolean;
   error: Error | null;
   fn: (...args: Args) => Promise<void>;
   setData: React.Dispatch<React.SetStateAction<T | undefined>>;
};

export default function useFetch<T, Args extends unknown[]>(
   cb: (...args: Args) => Promise<T>,
): UseFetchReturn<T, Args> {
   const [data, setData] = useState<T | undefined>(undefined);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const fn = useCallback(
      async (...args: Args): Promise<void> => {
         setLoading(true);
         setError(null);

         try {
            const response = await cb(...args);
            setData(response);
         } catch (err: unknown) {
            const fetchError =
               err instanceof Error
                  ? err
                  : new Error("Something went wrong. Please try again.");

            setError(fetchError);
            toast.error(fetchError.message);
         } finally {
            setLoading(false);
         }
      },
      [cb],
   );

   return { data, loading, error, fn, setData };
}
