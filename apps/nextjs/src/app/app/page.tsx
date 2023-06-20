import type { Metadata } from "next";

import { getServerSession } from "~/lib/getServerSession";

import Logout from "./logout";

export const metadata: Metadata = {
   title: "Home",
};

const Page = async () => {
   const session = await getServerSession();

   return (
      <h1>
         This is the app, you are logged in as {session?.name}, <Logout />
      </h1>
   );
};

export default Page;
