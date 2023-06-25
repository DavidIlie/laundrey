import type { Metadata } from "next";

import { api } from "~/trpc/server";

import AppLayout from "~/app/layout/app-layout";
import CreateForm from "./create-form";

export const metadata: Metadata = {
   title: "New Laundry",
};

const Page = async () => {
   const clothes = await api.clothes.allForLaundry.query();
   return (
      <AppLayout
         title="New Laundry"
         description="Add a new laundry event"
         className="max-w-md"
      >
         <CreateForm clothes={clothes} />
      </AppLayout>
   );
};

export default Page;
