import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
   server: {
      JWT_SECRET: z.string(),
      MINIO_ACCESS_KEY_ID: z.string(),
      MINIO_SECRET_ACCESS_KEY: z.string(),
      MINIO_BUCKET: z.string().default("laundrey"),
      MINIO_URL: z.string(),
   },
   client: {},
   runtimeEnv: {
      JWT_SECRET: process.env.JWT_SECRET,
      MINIO_ACCESS_KEY_ID: process.env.MINIO_ACCESS_KEY_ID,
      MINIO_SECRET_ACCESS_KEY: process.env.MINIO_SECRET_ACCESS_KEY,
      MINIO_BUCKET: process.env.MINIO_BUCKET,
      MINIO_URL: process.env.MINIO_URL,
   },
   skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
