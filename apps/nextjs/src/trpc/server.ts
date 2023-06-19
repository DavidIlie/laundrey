"use server";

import { headers } from "next/headers";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { experimental_createTRPCNextAppDirServer } from "@trpc/next/app-dir/server";
import superjson from "superjson";

import type { AppRouter } from "@laundrey/api";

import { getUrl } from "./shared";

export const api = experimental_createTRPCNextAppDirServer<AppRouter>({
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
                     ...Object.fromEntries(headers()),
                     "x-trpc-source": "rsc",
                  };
               },
            }),
         ],
      };
   },
});

export { type RouterInputs, type RouterOutputs } from "@laundrey/api";
