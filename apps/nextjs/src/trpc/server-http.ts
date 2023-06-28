"use server";

import { cookies } from "next/headers";
import { loggerLink } from "@trpc/client";
import { experimental_nextHttpLink } from "@trpc/next/app-dir/links/nextHttp";
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
            experimental_nextHttpLink({
               batch: true,
               url: getUrl(),
               headers() {
                  return {
                     cookie: cookies().toString(),
                     "x-trpc-source": "rsc-http",
                  };
               },
            }),
         ],
      };
   },
});

export { type RouterInputs, type RouterOutputs } from "@laundrey/api";
