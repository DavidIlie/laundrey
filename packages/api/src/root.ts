import { clothesRouter } from "./router/clothes";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
   user: userRouter,
   clothes: clothesRouter,
});

export type AppRouter = typeof appRouter;
