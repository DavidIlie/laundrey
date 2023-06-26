/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import * as SecureStore from "expo-secure-store";
import superjson from "superjson";

import type { AppRouter } from "@laundrey/api";

import { ACCESS_KEY } from "./constants";

export const api = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from "@laundrey/api";

export const TRPCProvider: React.FC<{
   children: React.ReactNode;
   apiUrl: string;
}> = ({ children, apiUrl }) => {
   if (!apiUrl) return <View />;

   const [queryClient] = React.useState(() => new QueryClient());
   const [trpcClient] = React.useState(() =>
      api.createClient({
         transformer: superjson,
         links: [
            httpBatchLink({
               url: `${apiUrl}/api/trpc`,
               async headers() {
                  const sessionToken = await SecureStore.getItemAsync(
                     ACCESS_KEY,
                  );
                  return {
                     access: sessionToken ? sessionToken : undefined,
                     "Content-Type": "application/json",
                     Accept: "application/json",
                  };
               },
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
