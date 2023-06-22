import { TRPCError } from "@trpc/server";

import { findByIdValidator } from "../../validators";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const laundryRouter = createTRPCRouter({
   all: protectedProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.laundryEvent.findMany({
         where: { userId: ctx.session.id },
         include: {
            _count: {
               select: {
                  laundryItem: true,
               },
            },
         },
      });
   }),
   get: protectedProcedure
      .input(findByIdValidator)
      .query(async ({ ctx, input }) => {
         return await ctx.prisma.laundryEvent.findFirst({
            where: { id: input.id, userId: ctx.session.id },
            include: { laundryItem: true },
         });
      }),
});
