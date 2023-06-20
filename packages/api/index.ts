import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./src/root";

export { createTRPCContext, createInnerTRPCContext } from "./src/trpc";

export { t } from "./src/trpc";

export type { AppRouter } from "./src/root";

export type RouterInputs = inferRouterInputs<AppRouter>;

export type RouterOutputs = inferRouterOutputs<AppRouter>;

export { getServerSessionUser } from "./src/lib/session-user";
