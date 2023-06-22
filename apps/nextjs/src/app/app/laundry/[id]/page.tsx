import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { api } from "~/trpc/server";
import { getServerSession } from "~/lib/getServerSession";

import { createLaundryEventName } from "@laundrey/api/client";
import { prisma } from "@laundrey/db";

import AppLayout from "~/app/layout/app-layout";

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
         <h1>hi</h1>
      </AppLayout>
   );
};

export default Page;
