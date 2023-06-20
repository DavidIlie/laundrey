import { redirect } from "next/navigation";

import { getServerSession } from "~/lib/getServerSession";

import { prisma } from "@laundrey/db";

const Page = async () => {
   const userCount = await prisma.user.count();
   if (userCount === 0) return redirect("/welcome");

   const session = await getServerSession();

   if (session) return redirect("/app");

   if (!session) return redirect("/login");
};

export default Page;
