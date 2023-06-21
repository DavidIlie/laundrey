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
      <div className="flex min-h-screen flex-col lg:flex-row">
         <Navigation />
         <div className="flex-grow bg-gray-50 px-2 py-4 dark:bg-container lg:min-h-screen lg:w-full lg:flex-grow-0 lg:p-6">
            {children}
         </div>
      </div>
   );
}
