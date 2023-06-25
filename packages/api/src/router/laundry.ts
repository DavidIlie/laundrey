import { TRPCError } from "@trpc/server";

import { findByIdValidator, laundryEventValidator } from "../../validators";
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
         orderBy: {
            created: "desc",
         },
      });
   }),
   create: protectedProcedure
      .input(laundryEventValidator)
      .mutation(async ({ ctx, input }) => {
         await Promise.all(
            input.items.map(async (item) => {
               const clothing = await ctx.prisma.clothing.findFirst({
                  where: { userId: ctx.session.id, id: item.clothingId },
               });
               if (!clothing)
                  throw new TRPCError({
                     message: "cannot find clothing",
                     code: "NOT_FOUND",
                  });

               if (item.quantity > clothing.quantity)
                  throw new TRPCError({
                     message: `Too much of ${clothing.name}!`,
                     code: "BAD_REQUEST",
                  });

               if (clothing.quantity === 1) {
                  const isInLaundry = await ctx.prisma.laundryItem.findFirst({
                     where: {
                        clothingId: clothing.id,
                        returned: null,
                     },
                  });
                  if (isInLaundry)
                     throw new TRPCError({
                        message: "this is already in laundry",
                        code: "BAD_REQUEST",
                     });

                  return;
               }

               const attempt = await ctx.prisma.laundryItem.findMany({
                  where: {
                     clothingId: item.clothingId,
                     AND: { returned: null },
                  },
               });
               if (!attempt) return;
               let alreadyCount = 0;
               attempt.forEach(
                  (s) => (alreadyCount = alreadyCount + s.quantity),
               );
               if (alreadyCount + item.quantity > clothing.quantity)
                  throw new TRPCError({
                     message: `Too much of ${clothing.name}!`,
                     code: "BAD_REQUEST",
                  });
            }),
         );

         await ctx.prisma.laundryEvent.create({
            data: {
               userId: ctx.session.id,
               laundryItem: {
                  create: input.items,
               },
            },
         });

         return true;
      }),
   get: protectedProcedure
      .input(findByIdValidator)
      .query(async ({ ctx, input }) => {
         return await ctx.prisma.laundryEvent.findFirst({
            where: { id: input.id, userId: ctx.session.id },
            include: {
               laundryItem: {
                  include: {
                     clothing: {
                        include: { categories: true, brand: true },
                     },
                  },
               },
            },
         });
      }),
   inLaundry: protectedProcedure
      .input(findByIdValidator)
      .query(async ({ ctx, input }) => {
         return await ctx.prisma.laundryItem.findFirst({
            where: {
               clothingId: input.id,
               returned: null,
            },
         });
      }),
   removeItem: protectedProcedure
      .input(findByIdValidator)
      .mutation(async ({ ctx, input }) => {
         const laundryItem = await ctx.prisma.laundryItem.findFirst({
            where: {
               id: input.id,
               AND: {
                  laundryEvent: {
                     userId: ctx.session.id,
                  },
               },
            },
         });

         if (!laundryItem)
            throw new TRPCError({
               message: "Cannot find laundry item",
               code: "NOT_FOUND",
            });

         await ctx.prisma.laundryItem.delete({ where: { id: laundryItem.id } });

         return true;
      }),
   finishItem: protectedProcedure
      .input(findByIdValidator)
      .mutation(async ({ ctx, input }) => {
         const laundryItem = await ctx.prisma.laundryItem.findFirst({
            where: {
               id: input.id,
               AND: {
                  laundryEvent: {
                     userId: ctx.session.id,
                  },
               },
            },
            select: { id: true, laundryEvent: { include: { user: true } } },
         });

         if (!laundryItem)
            throw new TRPCError({
               message: "Cannot find laundry item",
               code: "NOT_FOUND",
            });

         await ctx.prisma.laundryItem.update({
            where: { id: laundryItem.id },
            data: { returned: new Date() },
         });

         const unfinishedItems = await ctx.prisma.laundryItem.count({
            where: {
               laundryEvent: { id: laundryItem.laundryEvent.id },
               returned: null,
            },
         });

         if (unfinishedItems === 0)
            await ctx.prisma.laundryEvent.update({
               where: { id: laundryItem.laundryEvent.id },
               data: { finished: new Date() },
            });

         return true;
      }),
});
