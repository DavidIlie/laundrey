import * as Minio from "minio";

import { env } from "../env.mjs";

export const minio = new Minio.Client({
   endPoint: env.MINIO_URL,
   port: 443,
   useSSL: true,
   accessKey: env.MINIO_ACCESS_KEY_ID,
   secretKey: env.MINIO_SECRET_ACCESS_KEY,
});
