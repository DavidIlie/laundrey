import { createTRPCRouter, publicProcedure } from "../trpc";

export const helloRouter = createTRPCRouter({
   hello: publicProcedure.query(({ ctx }) => {
      return "hi!";
   }),
});
