import type { Metadata } from "next";

import { api } from "~/trpc/server-invoker";

import AppLayout from "~/app/layout/app-layout";
import CreateForm from "./create-form";

export const metadata: Metadata = {
   title: "New Clothing",
};

const Page = async () => {
   const categories = await api.categories.all.query();
   const brands = await api.brands.all.query();

   return (
      <AppLayout
         title="New Clothing"
         description="Add a new piece of clothing to Laundrey"
         className="max-w-2xl"
      >
         <CreateForm categories={categories} brands={brands} />
      </AppLayout>
   );
};

export default Page;
