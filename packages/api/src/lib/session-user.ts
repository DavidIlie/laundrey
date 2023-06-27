import { verify } from "jsonwebtoken";

import { prisma } from "@laundrey/db";

import { env } from "../env.mjs";
import { AccessTokenData } from "./token";

export type BaseUser = {
   id: string;
   name: string;
   username: string;
   email: string;
   image: string | null;
   isAdmin: boolean;
};

export type User = BaseUser | null;

export const getServerSessionUser = async (cookie?: string) => {
   try {
      if (!cookie) return null;

      const data = <AccessTokenData>verify(cookie, env.JWT_SECRET);

      if (!data) return null;

      const user = await prisma.user.findFirst({
         where: { id: data.userId },
         select: {
            id: true,
            isAdmin: true,
            email: true,
            name: true,
            username: true,
            image: true,
            tokenLifecycle: true,
         },
      });

      if (!user) throw new Error("impossible");

      if (data.tokenLifecycle !== user.tokenLifecycle) return null;

      return user;
   } catch (error) {
      return null;
   }
};
