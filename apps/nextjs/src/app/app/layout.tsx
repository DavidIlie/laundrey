import { redirect } from "next/navigation";

import { getServerSession } from "~/lib/getServerSession";

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const session = await getServerSession();
   if (!session) redirect("/");

   return <>{children}</>;
}
