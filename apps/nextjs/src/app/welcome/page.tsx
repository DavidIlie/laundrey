import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { prisma } from "@laundrey/db";

import NewUserForm from "./new-user-form";

export const metadata: Metadata = {
   title: "Welcome",
};

const Page = async () => {
   const userCount = await prisma.user.count();
   if (userCount !== 0) redirect("/");

   return (
      <div className="flex justify-center flex-grow py-12 sm:px-6 lg:px-8">
         <div className="w-full sm:mx-auto sm:max-w-md">
            <div className="px-2 sm:px-0">
               <h1 className="text-2xl font-medium">Welcome!</h1>
               <p className="text-sm text-gray-500 dark:text-gray-400">
                  You need to create the first administrator account for
                  Laundrey.
               </p>
            </div>
            <div className="px-4 py-6 mt-2 border-2 shadow dark:border-border dark:bg-container sm:rounded-lg sm:border-l sm:border-r sm:px-10">
               <NewUserForm />
            </div>
         </div>
      </div>
   );
};

export default Page;
