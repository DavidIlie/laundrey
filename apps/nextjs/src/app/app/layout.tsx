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
      <div className="flex min-h-screen">
         <Navigation className="relative w-[20%] p-5" />
         <div className="w-[80%] bg-gray-50 p-6 dark:bg-container">
            {children}
         </div>
      </div>
   );
}
