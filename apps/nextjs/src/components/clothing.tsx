import Image from "next/image";
import Link from "next/link";

import type { RouterOutputs } from "~/trpc/shared";

import { shimmer } from "@laundrey/ui";
import { Badge } from "@laundrey/ui/badge";

const Clothing: React.FC<{ clothing: RouterOutputs["clothes"]["all"][0] }> = ({
   clothing,
}) => {
   return (
      <Link
         className="w-full rounded-md bg-white p-4 shadow-md dark:bg-gray-800 md:max-w-[18rem]"
         href={`/app/clothing/${clothing.id}`}
      >
         <div className="mb-2">
            <div className="relative mx-auto h-96 w-full md:h-48 md:w-64">
               <Image
                  src={
                     clothing.photos.length === 0
                        ? "/no-photo.png"
                        : clothing.photos[0]!
                  }
                  alt={clothing.name}
                  fill
                  className="rounded-md object-cover"
                  placeholder="blur"
                  blurDataURL={shimmer(1000, 1000)}
               />
            </div>
         </div>
         <div className="mb-4">
            <h3 className="text-xl font-semibold">{clothing.name}</h3>
            {clothing.brand && (
               <p className="-mt-1 text-sm text-gray-600 dark:text-gray-500">
                  {clothing.brand}
               </p>
            )}
         </div>
         <div className="-mb-1 flex flex-wrap">
            {clothing.categories.map((category) => (
               <Badge key={category.id}>{category.name}</Badge>
            ))}
         </div>
      </Link>
   );
};

export default Clothing;