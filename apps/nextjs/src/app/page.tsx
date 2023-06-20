import { redirect } from "next/navigation";

import { getServerSession } from "~/lib/getServerSession";

import { prisma } from "@laundrey/db";

import TestClient from "./test-client";

const Page = async () => {
   const userCount = await prisma.user.count();
   if (userCount === 0) redirect("/welcome");

   const session = await getServerSession();

   return (
      <>
         <h1>(SERVER) hi, {session?.name}</h1>
         <TestClient />
      </>
   );
};

export default Page;
