import Link from "next/link";

import { api } from "~/trpc/server";

import { Button } from "@laundrey/ui/button";

import Clothing from "~/components/clothing";

const ClothesModule = async () => {
   const clothes = await api.clothes.all.query();
   return (
      <>
         <Link href="/app/new/clothing">
            <Button className="mb-3">Add new</Button>
         </Link>
         <div className="grid grid-cols-1 space-y-4 sm:grid-cols-2 sm:space-y-0 lg:grid-cols-4">
            {clothes.map((clothing, index) => (
               <Clothing clothing={clothing} key={index} />
            ))}
            {clothes.length === 0 && <p>No clothes...</p>}
         </div>
      </>
   );
};

export default ClothesModule;
