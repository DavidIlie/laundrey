import { headers } from "next/headers";
import { experimental_createServerActionHandler } from "@trpc/next/app-dir/server";
import { initTRPC } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import superjson from "superjson";
import { ZodError } from "zod";

import { prisma } from "@laundrey/db";

type CreateContextOptions = {
   headers: Headers;
};

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
   return {
      prisma,
      headers: opts.headers,
   };
};

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
   const { req } = opts;

   return createInnerTRPCContext({
      headers: opts.req.headers,
   });
};

export const t = initTRPC.context<typeof createTRPCContext>().create({
   transformer: superjson,
   errorFormatter({ shape, error }) {
      return {
         ...shape,
         data: {
            ...shape.data,
            zodError:
               error.cause instanceof ZodError ? error.cause.flatten() : null,
         },
      };
   },
});

export const createAction = experimental_createServerActionHandler(t, {
   async createContext() {
      const ctx = await createInnerTRPCContext({
         headers: headers(),
      });
      return ctx;
   },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

// const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
//   if (!ctx.session?.user) {
//     throw new TRPCError({ code: "UNAUTHORIZED" });
//   }
//   return next({
//     ctx: {
//       // infers the `session` as non-nullable
//       session: { ...ctx.session, user: ctx.session.user },
//     },
//   });
// });

// export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
