import { sign } from "jsonwebtoken";

import { User } from "@laundrey/db";

import { env } from "../env.mjs";

export type AccessTokenData = {
   userId: string;
   tokenLifecycle: number;
};

export const createTokens = (
   user: User,
   remember: boolean,
): { accessToken: string } => {
   const accessToken = sign(
      { userId: user.id, tokenLifecycle: user.tokenLifecycle },
      env.JWT_SECRET,
      {
         expiresIn: remember ? "7d" : "1d",
      },
   );

   return { accessToken };
};

export const getMaxAge = (remember: boolean): number =>
   remember ? 604800000 : 86400000;
