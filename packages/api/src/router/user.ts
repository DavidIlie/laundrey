import { TRPCError } from "@trpc/server";

import { loginValidator, newAdminUserValidator } from "../../validators";
import { createUsername } from "../lib/create-username";
import { hashPassword, verifyPasswordToHashed } from "../lib/password";
import { getServerSessionUser } from "../lib/session-user";
import { createTokens } from "../lib/token";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
   login: publicProcedure
      .input(loginValidator)
      .mutation(async ({ ctx, input }) => {
         const user = await ctx.prisma.user.findFirst({
            where: { email: input.email },
         });
         if (!user)
            throw new TRPCError({
               message: "Couldn't find email address",
               code: "FORBIDDEN",
            });

         if (!(await verifyPasswordToHashed(user.password, input.password)))
            throw new TRPCError({
               message: "Password does not match the email.",
               code: "FORBIDDEN",
            });

         const { accessToken } = createTokens(user, input.remember);

         const session = await getServerSessionUser(accessToken);

         return { accessToken, session };
      }),
   session: protectedProcedure.query(async ({ ctx }) => {
      return ctx.session;
   }),
   createFirstUser: publicProcedure
      .input(newAdminUserValidator)
      .mutation(async ({ ctx, input }) => {
         if ((await ctx.prisma.user.count()) !== 0)
            return new TRPCError({
               message: "you cannot use this function",
               code: "BAD_REQUEST",
            });

         const user = await ctx.prisma.user.create({
            data: {
               email: input.email,
               name: input.name,
               password: await hashPassword(input.password),
               username: await createUsername(input.name),
               isAdmin: true,
            },
         });

         const { accessToken } = createTokens(user, false);

         const session = await getServerSessionUser(accessToken);

         return { accessToken, session };
      }),
});
