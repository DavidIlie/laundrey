import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { api } from "~/trpc/server";
import { getServerSession } from "~/lib/getServerSession";

import { prisma } from "@laundrey/db";
import { Badge } from "@laundrey/ui/badge";

import AppLayout from "~/app/layout/app-layout";
import ImageViewer from "./image-viewer";

export async function generateMetadata(params: {
   id: string;
}): Promise<Metadata> {
   const session = await getServerSession();

   if (!session) return {};

   const clothing = await prisma.clothing.findFirst({
      where: { id: params.id, userId: session.id },
   });

   if (!clothing) return {};

   return { title: clothing.name };
}

const Page = async ({ params }: { params: { id: string } }) => {
   const clothing = await api.clothes.get.query({ id: params.id });

   if (!clothing) return redirect("/app");

   return (
      <AppLayout title={clothing.name} className="max-w-3xl">
         <div className="lg:flex">
            <div className="lg:w-2/3">
               <div className="mb-4 mt-1">
                  {clothing.categories.map((category, index) => (
                     <Badge key={index}>{category.name}</Badge>
                  ))}
               </div>
               <div className="mb-2 mt-3 border-t-2 dark:border-gray-400 lg:mr-4" />
               <h1>Brand: {clothing.brand}</h1>
               <h1>Quantity: {clothing.quantity.toString()}</h1>
               <h1>Date Added: {clothing.created.toDateString()}</h1>
               <div className="mb-4 mt-3 border-t-2 dark:border-gray-400 lg:mr-4" />
            </div>
            <div className="1/3 space-y-3">
               {clothing.photos.map((photo, index) => (
                  <ImageViewer photo={photo} index={index} key={index} />
               ))}
            </div>
         </div>
      </AppLayout>
   );
};

export default Page;
