import type { Metadata } from "next";
import Link from "next/link";

import { api } from "~/trpc/server";

import { Button } from "@laundrey/ui/button";

import Clothing from "~/components/clothing";
import AppLayout from "~/app/layout/app-layout";

export const metadata: Metadata = {
   title: "Clothes",
};

const Page = async () => {
   const clothes = await api.clothes.all.query();
   return (
      <AppLayout
         title="Clothing"
         description="Manage all your items of clothing."
      >
         <Link href="/app/new/clothing">
            <Button className="mb-3">Add new</Button>
         </Link>
         <div className="grid grid-cols-1 space-y-4 sm:grid-cols-2 sm:space-y-0 lg:grid-cols-4">
            {clothes.map((clothing, index) => (
               <Clothing clothing={clothing} key={index} />
            ))}
         </div>
      </AppLayout>
   );
};

export default Page;
