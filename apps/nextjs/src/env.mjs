import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
   server: {
      DATABASE_URL: z.string().url(),
      NODE_ENV: z.enum(["development", "test", "production"]),
      APP_URL: z.string().min(1),
   },
   client: {},
   runtimeEnv: {
      DATABASE_URL: process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV,
      APP_URL: process.env.APP_URL,
   },
   skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
