import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { formatDistance } from "date-fns";

import { api } from "~/trpc/server";
import { getServerSession } from "~/lib/getServerSession";

import { createLaundryEventName } from "@laundrey/api/client";
import { prisma } from "@laundrey/db";

import Clothing from "~/components/clothing";
import AppLayout from "~/app/layout/app-layout";
import DeleteItem from "./delete-item";
import FinishItem from "./finish-item";

export async function generateMetadata(params: {
   id: string;
}): Promise<Metadata> {
   const session = await getServerSession();

   if (!session) return {};

   const event = await prisma.laundryEvent.findFirst({
      where: { id: params.id, userId: session.id },
   });

   if (!event) return {};

   return {
      title: createLaundryEventName(event.created),
   };
}

const Page = async ({ params }: { params: { id: string } }) => {
   const event = await api.laundry.get.query({ id: params.id });

   if (!event) redirect("/app");

   return (
      <AppLayout title={createLaundryEventName(event.created)}>
         <div className="grid grid-cols-1 space-y-4 sm:grid-cols-2 sm:space-y-0 lg:grid-cols-4">
            {event.laundryItem.map((item) => (
               <Clothing clothing={item.clothing} key={item.id}>
                  {item.returned && (
                     <p className="text-sm text-gray-500 dark:text-gray-400">
                        Returned{" "}
                        {formatDistance(item.returned, new Date(), {
                           addSuffix: true,
                        })}
                     </p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                     <FinishItem id={item.id} returned={item.returned} />
                     <DeleteItem id={item.id} />
                  </div>
               </Clothing>
            ))}
         </div>
      </AppLayout>
   );
};

export default Page;
