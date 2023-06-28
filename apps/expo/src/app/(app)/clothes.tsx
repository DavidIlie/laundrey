import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import ClothesModule from "~/modules/app/clothes/clothes";

const Page = () => {
   const [selectedTab, setSelectedTab] = useState(1);
   return (
      <View>
         <View className="flex h-10 flex-row items-center justify-center bg-[#f1f5f9] p-1 text-muted-foreground">
            <TouchableOpacity
               className={`inline-flex w-1/3 items-center justify-center whitespace-nowrap px-3 py-1.5 text-center text-sm font-medium ring-offset-background transition-all disabled:pointer-events-none disabled:opacity-50 ${
                  selectedTab === 1 && "bg-white text-gray-800 shadow-sm"
               }`}
               onPress={() => setSelectedTab(1)}
            >
               <Text>Clothes</Text>
            </TouchableOpacity>
            <TouchableOpacity
               className={`inline-flex w-1/3 items-center justify-center whitespace-nowrap px-3 py-1.5 text-center text-sm font-medium ring-offset-background transition-all disabled:pointer-events-none disabled:opacity-50 ${
                  selectedTab === 2 && "bg-white text-gray-800 shadow-sm"
               }`}
               onPress={() => setSelectedTab(2)}
            >
               <Text>Brands</Text>
            </TouchableOpacity>
            <TouchableOpacity
               className={`inline-flex w-1/3 items-center justify-center whitespace-nowrap px-3 py-1.5 text-center text-sm font-medium ring-offset-background transition-all disabled:pointer-events-none disabled:opacity-50 ${
                  selectedTab === 3 && "bg-white text-gray-800 shadow-sm"
               }`}
               onPress={() => setSelectedTab(3)}
            >
               <Text>Categories</Text>
            </TouchableOpacity>
         </View>
         <View className="p-2">{selectedTab === 1 && <ClothesModule />}</View>
      </View>
   );
};

export default Page;
