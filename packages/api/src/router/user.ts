import { TRPCError } from "@trpc/server";

import { newAdminUserValidator } from "../../validators";
import { createUsername } from "../lib/createUsername";
import { hashPassword } from "../lib/password";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
   createFirstUser: publicProcedure
      .input(newAdminUserValidator)
      .mutation(async ({ ctx, input }) => {
         if ((await ctx.prisma.user.count()) !== 0)
            return new TRPCError({
               message: "you cannot use this function",
               code: "BAD_REQUEST",
            });

         await ctx.prisma.user.create({
            data: {
               email: input.email,
               name: input.name,
               password: await hashPassword(input.password),
               username: await createUsername(input.name),
               isAdmin: true,
            },
         });
         return true;
      }),
});
