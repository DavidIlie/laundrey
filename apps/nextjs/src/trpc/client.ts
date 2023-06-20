import { httpBatchLink, loggerLink } from "@trpc/client";
import { experimental_createTRPCNextAppDirClient } from "@trpc/next/app-dir/client";
import superjson from "superjson";

import type { AppRouter } from "@laundrey/api";

import { getUrl } from "./shared";

export const api = experimental_createTRPCNextAppDirClient<AppRouter>({
   config() {
      return {
         transformer: superjson,
         links: [
            loggerLink({
               enabled: (opts) =>
                  process.env.NODE_ENV === "development" ||
                  (opts.direction === "down" && opts.result instanceof Error),
            }),
            httpBatchLink({
               url: getUrl(),
               headers() {
                  return {
                     "x-trpc-source": "client",
                  };
               },
            }),
         ],
      };
   },
});

export { type RouterInputs, type RouterOutputs } from "@laundrey/api";
