/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use server";

import { api } from "~/trpc/server-invoker";

import type { AppRouter } from "@laundrey/api";

export const revalidateTRPC = async (
   router: keyof AppRouter["_def"]["procedures"],
   procedure: unknown,
) => {
   //@ts-ignore
   return await api[router][procedure].revalidate();
};
