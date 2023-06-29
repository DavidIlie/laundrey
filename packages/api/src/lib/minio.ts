import * as Minio from "minio";

import { env } from "../env.mjs";

export const createMinio = () =>
   new Minio.Client({
      endPoint: env.MINIO_URL,
      port: parseInt(env.MINIO_PORT),
      useSSL: env.MINIO_PROTOCOL === "https",
      accessKey: env.MINIO_ACCESS_KEY_ID,
      secretKey: env.MINIO_SECRET_ACCESS_KEY,
   });
