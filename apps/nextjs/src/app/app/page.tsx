import type { Metadata } from "next";

import AppLayout from "../layout/app-layout";

export const metadata: Metadata = {
   title: "Home",
};

const Page = () => {
   return (
      <AppLayout title="Dashboard">
         <h1>Hello</h1>
      </AppLayout>
   );
};

export default Page;
