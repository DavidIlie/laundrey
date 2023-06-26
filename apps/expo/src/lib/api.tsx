import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import superjson from "superjson";

import type { AppRouter } from "@laundrey/api";

export const api = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from "@laundrey/api";

const getBaseUrl = async () => {
   const storedUrl = await SecureStore.getItemAsync("api_url");
   if (!__DEV__ && !storedUrl) {
      await SecureStore.setItemAsync(
         "api_url",
         "https://laundrey.davidapps.dev",
      );
      return "https://laundrey.davidapps.dev";
   }
   if (storedUrl) return storedUrl;
   const localhost = Constants.manifest?.debuggerHost?.split(":")[0];
   if (!localhost) {
      throw new Error(
         "Failed to get localhost. Please point to your production server.",
      );
   }
   return `http://${localhost}:3000`;
};

export const TRPCProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const [queryClient] = React.useState(() => new QueryClient());
   const [trpcClient] = React.useState(() =>
      api.createClient({
         transformer: superjson,
         links: [
            httpBatchLink({
               url: `${getBaseUrl()}/api/trpc`,
            }),
         ],
      }),
   );

   return (
      <api.Provider client={trpcClient} queryClient={queryClient}>
         <QueryClientProvider client={queryClient}>
            {children}
         </QueryClientProvider>
      </api.Provider>
   );
};
