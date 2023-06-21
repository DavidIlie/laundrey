import Image from "next/image";
import Link from "next/link";

import type { RouterOutputs } from "~/trpc/shared";

import { shimmer } from "@laundrey/ui";

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
               <p className="-mt-1 text-sm text-gray-600">{clothing.brand}</p>
            )}
         </div>
         <ul className="-mb-1 flex flex-wrap">
            {clothing.categories.map((category) => (
               <li
                  key={category.id}
                  className="mb-2 mr-2 rounded-md bg-gray-200 px-2 py-1 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-300"
               >
                  {category.name}
               </li>
            ))}
         </ul>
      </Link>
   );
};

export default Clothing;
