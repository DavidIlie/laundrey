import { redirect } from "next/navigation";

import { prisma } from "@laundrey/db";

import TestClient from "./test-client";

const Page = async () => {
   const userCount = await prisma.user.count();
   if (userCount === 0) redirect("/welcome");
   return <TestClient />;
};

export default Page;
