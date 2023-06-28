import React from "react";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";

import { api } from "~/lib/api";

import type { RouterOutputs } from "@laundrey/api";

const Clothing: React.FC<{
   clothing: RouterOutputs["clothes"]["all"][0];
   children?: React.ReactNode;
}> = ({ clothing, children }) => {
   const { isLoading, data } = api.laundry.inLaundry.useQuery({
      id: clothing.id,
   });

   return (
      <View className="w-full rounded-md bg-white p-4 shadow-md">
         <Link href={`/app/clothing/${clothing.id}`} className="mb-2">
            <Image
               source={
                  clothing.photos[0] || "http://localhost:3000/no-photo.png"
               }
            />
         </Link>
         <Text className="text-xl font-semibold">{clothing.name}</Text>
         {clothing.brand && (
            <Text className="-mt-1 text-sm text-gray-600">
               {clothing.brand.name}
            </Text>
         )}
         <View className="mb-4">{children}</View>
         <View className="-mb-1 flex flex-wrap gap-2">
            {data && (
               <Text className="inline-flex items-center rounded-full border border-transparent bg-red-300 px-2.5 py-0.5 text-xs font-semibold text-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  In Laundry
               </Text>
            )}
            {clothing.categories.map((category) => (
               <Text
                  className="inline-flex items-center rounded-full border border-transparent bg-gray-300 px-2.5 py-0.5 text-xs font-semibold text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  key={category.id}
               >
                  {category.name}
               </Text>
            ))}
         </View>
      </View>
   );
};

export default Clothing;
