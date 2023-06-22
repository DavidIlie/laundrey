import { brandsRouter } from "./router/brands";
import { categoriesRouter } from "./router/categories";
import { clothesRouter } from "./router/clothes";
import { laundryRouter } from "./router/laundry";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
   user: userRouter,
   clothes: clothesRouter,
   categories: categoriesRouter,
   brands: brandsRouter,
   laundry: laundryRouter,
});

export type AppRouter = typeof appRouter;
