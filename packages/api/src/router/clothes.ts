import { createTRPCRouter, protectedProcedure } from "../trpc";

export const clothesRouter = createTRPCRouter({
   all: protectedProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.clothing.findMany({
         where: { userId: ctx.session.id },
         include: { categories: true },
      });
   }),
});
