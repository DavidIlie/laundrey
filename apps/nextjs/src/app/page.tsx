import { redirect } from "next/navigation";

import { prisma } from "@laundrey/db";

const Page = async () => {
   const userCount = await prisma.user.count();
   if (userCount === 0) redirect("/welcome");
   return <></>;
};

export default Page;
