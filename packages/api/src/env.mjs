import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
   server: {
      JWT_SECRET: z.string(),
   },
   client: {},
   runtimeEnv: {
      JWT_SECRET: process.env.JWT_SECRET,
   },
   skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
