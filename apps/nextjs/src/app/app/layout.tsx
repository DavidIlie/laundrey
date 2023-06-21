import { redirect } from "next/navigation";

import { getServerSession } from "~/lib/getServerSession";

import Navigation from "./navigation";

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const session = await getServerSession();
   if (!session) redirect("/");

   return (
      <div className="flex flex-col min-h-screen lg:flex-row">
         <Navigation />
         <div className="flex-grow px-2 py-4 bg-gray-100 dark:bg-container lg:min-h-screen lg:w-full lg:flex-grow-0 lg:p-6">
            {children}
         </div>
      </div>
   );
}
