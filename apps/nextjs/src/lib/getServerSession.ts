// wrapper to get cookie

import { cookies } from "next/headers";

import { getServerSessionUser } from "@laundrey/api";

export const getServerSession = async () => {
   const cookieJar = cookies();
   const cookie = cookieJar.get("access");
   if (!cookie) return;
   return await getServerSessionUser(cookie.value);
};
