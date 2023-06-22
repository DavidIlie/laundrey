import { api } from "~/trpc/server";

import AppLayout from "~/app/layout/app-layout";
import CreateForm from "./create-form";

const Page = async () => {
   const categories = await api.categories.all.query();

   return (
      <AppLayout
         title="New Clothing"
         description="Add a new piece of clothing to Laundrey"
         className="max-w-2xl"
      >
         <CreateForm categories={categories} />
      </AppLayout>
   );
};

export default Page;
