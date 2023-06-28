"use server";

import { headers } from "next/headers";
import { loggerLink } from "@trpc/client";
import { experimental_nextCacheLink } from "@trpc/next/app-dir/links/nextCache";
import { experimental_createTRPCNextAppDirServer } from "@trpc/next/app-dir/server";
import SuperJSON from "superjson";

import { getServerSession } from "~/lib/getServerSession";

import { createInnerTRPCContext } from "@laundrey/api";
import { appRouter } from "@laundrey/api/src/root";

/**
 * This client invokes procedures directly on the server without fetching over HTTP.
 */
export const api = experimental_createTRPCNextAppDirServer<typeof appRouter>({
   config() {
      return {
         transformer: SuperJSON,
         links: [
            loggerLink({
               enabled: (opts) =>
                  process.env.NODE_ENV === "development" ||
                  (opts.direction === "down" && opts.result instanceof Error),
            }),
            experimental_nextCacheLink({
               revalidate: 5,
               router: appRouter,
               createContext: async () =>
                  createInnerTRPCContext({
                     headers: headers(),
                     user: await getServerSession(),
                  }),
            }),
         ],
      };
   },
});
