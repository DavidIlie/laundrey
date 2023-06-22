import type { Metadata } from "next";
import Link from "next/link";
import { formatDistance } from "date-fns";

import { api } from "~/trpc/server";

import { createLaundryEventName } from "@laundrey/api/client";
import { getRandomPatternStyle } from "@laundrey/ui";
import { Button } from "@laundrey/ui/button";
import {
   Card,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@laundrey/ui/card";

import AppLayout from "../../layout/app-layout";

export const metadata: Metadata = {
   title: "Laundry",
};

const Page = async () => {
   const events = await api.laundry.all.query();
   return (
      <AppLayout title="Laundry">
         <Button className="mb-3">New Event</Button>
         <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {events.map((event) => (
               <li key={event.id}>
                  <Link href={`/app/laundry/${event.id}`}>
                     <Card className="overflow-hidden">
                        <div
                           className="h-32"
                           style={getRandomPatternStyle(event.id)}
                        />
                        <CardHeader className="border-t-2 dark:bg-gray-800">
                           <CardTitle className="-mt-2">
                              {createLaundryEventName(event.created)}
                           </CardTitle>
                           <CardDescription>
                              {event._count.laundryItem} cloth
                              {event._count.laundryItem !== 0 ? "ing" : "es"}
                           </CardDescription>
                           <CardDescription>
                              {event.finished &&
                                 `Finished ${formatDistance(
                                    event.finished,
                                    new Date(),
                                    { addSuffix: true },
                                 )}`}
                           </CardDescription>
                        </CardHeader>
                     </Card>
                  </Link>
               </li>
            ))}
         </ul>
      </AppLayout>
   );
};

export default Page;
