import Image from "next/image";
import Link from "next/link";

import { api } from "~/trpc/server";
import type { RouterOutputs } from "~/trpc/shared";

import { shimmer } from "@laundrey/ui";
import { Badge } from "@laundrey/ui/badge";

const Clothing: React.FC<{
   clothing: RouterOutputs["clothes"]["all"][0];
   children?: React.ReactNode;
}> = async ({ clothing, children }) => {
   const isInLaundry = await api.laundry.inLaundry.query({ id: clothing.id });

   return (
      <div className="w-full rounded-md bg-white p-4 shadow-md dark:bg-gray-800 md:max-w-[18rem]">
         <Link href={`/app/clothing/${clothing.id}`}>
            <div className="mb-2">
               <div className="lg:flex-shrink-0">
                  <Image
                     src={
                        clothing.photos.length === 0
                           ? "/no-photo.png"
                           : clothing.photos[0]!
                     }
                     alt={clothing.name}
                     height="500"
                     width="500"
                     className="h-96 rounded-md object-cover lg:h-48"
                     placeholder="blur"
                     blurDataURL={shimmer(500, 500)}
                  />
               </div>
            </div>
            <h3 className="text-xl font-semibold">{clothing.name}</h3>
            {clothing.brand && (
               <p className="-mt-1 text-sm text-gray-600 dark:text-gray-500">
                  {clothing.brand.name}
               </p>
            )}
         </Link>
         <div className="mb-4">{children}</div>
         <div className="-mb-1 flex flex-wrap gap-2">
            {isInLaundry && <Badge variant="secondary">In Laundry</Badge>}
            {clothing.categories.map((category) => (
               <Badge key={category.id}>{category.name}</Badge>
            ))}
         </div>
      </div>
   );
};

export default Clothing;
