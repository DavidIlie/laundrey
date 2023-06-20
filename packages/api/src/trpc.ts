import { initTRPC, TRPCError } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import superjson from "superjson";
import { ZodError } from "zod";

import { prisma } from "@laundrey/db";

import { getServerSessionUser, User } from "./lib/session-user";

type CreateContextOptions = {
   headers: Headers;
   user: User;
};

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
   return {
      prisma,
      headers: opts.headers,
      user: opts.user,
   };
};

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
   const base = createInnerTRPCContext({
      headers: opts.req.headers,
      user: null,
   });

   try {
      let authCookie = opts.req.headers.get("cookie");
      authCookie = authCookie?.split("access=")[1] as string | null;
      if (!authCookie) return base;

      const user = await getServerSessionUser(authCookie);

      return {
         prisma,
         headers: opts.req.headers,
         user,
      };
   } catch (error) {}
   return createInnerTRPCContext({
      headers: opts.req.headers,
      user: null,
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

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
   if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
   }
   return next({
      ctx: {
         session: { ...ctx.user },
      },
   });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
