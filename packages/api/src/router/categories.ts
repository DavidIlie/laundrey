import { TRPCError } from "@trpc/server";

import { brandAndCategoryValidator, findByIdValidator } from "../../validators";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const categoriesRouter = createTRPCRouter({
   all: protectedProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.category.findMany({
         where: { userId: ctx.session.id },
         include: {
            _count: {
               select: {
                  clothes: true,
               },
            },
         },
         orderBy: {
            clothes: {
               _count: "desc",
            },
         },
      });
   }),
   create: protectedProcedure
      .input(brandAndCategoryValidator)
      .mutation(async ({ ctx, input }) => {
         const possible = await ctx.prisma.category.findFirst({
            where: { name: input.name, userId: ctx.session.id },
         });
         if (possible)
            return new TRPCError({
               message: "You already have a category with the same name!",
               code: "CONFLICT",
            });

         await ctx.prisma.category.create({
            data: { userId: ctx.session.id, ...input },
         });

         return true;
      }),
   get: protectedProcedure
      .input(findByIdValidator)
      .query(async ({ ctx, input }) => {
         const find = await ctx.prisma.category.findFirst({
            where: { id: input.id, userId: ctx.session.id },
            include: {
               _count: {
                  select: {
                     clothes: true,
                  },
               },
            },
            orderBy: {
               clothes: {
                  _count: "desc",
               },
            },
         });
         if (!find)
            throw new TRPCError({
               message: "Cannot find category",
               code: "NOT_FOUND",
            });

         return find;
      }),
   update: protectedProcedure
      .input(brandAndCategoryValidator.and(findByIdValidator))
      .mutation(async ({ ctx, input }) => {
         const find = await ctx.prisma.category.findFirst({
            where: { id: input.id, userId: ctx.session.id },
         });
         if (!find)
            throw new TRPCError({
               message: "Cannot find category",
               code: "NOT_FOUND",
            });

         await ctx.prisma.category.update({
            where: { id: input.id },
            data: input,
         });

         return true;
      }),
   delete: protectedProcedure
      .input(findByIdValidator)
      .mutation(async ({ ctx, input }) => {
         const find = await ctx.prisma.category.findFirst({
            where: { id: input.id, userId: ctx.session.id },
         });
         if (!find)
            throw new TRPCError({
               message: "Cannot find category",
               code: "NOT_FOUND",
            });

         await ctx.prisma.category.delete({ where: { id: find.id } });

         return true;
      }),
});
