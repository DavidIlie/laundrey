import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { env } from "~/env.mjs";

import type { AppRouter } from "@laundrey/api";

export const transformer = superjson;

function getBaseUrl() {
   if (typeof window !== "undefined") return "";
   const vc = env.APP_URL;
   if (vc) return vc;
   return "http://localhost:3000";
}

export function getUrl() {
   return getBaseUrl() + "/api/trpc";
}

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
