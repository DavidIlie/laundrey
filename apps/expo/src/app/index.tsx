import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { api } from "../lib/api";

const Page = () => {
   const trpc = api.hello.hello.useQuery();

   return (
      <SafeAreaView>
         <Stack.Screen options={{ title: "Home Page" }} />
         <View className="h-full w-full p-4">
            <Text className="mx-auto pb-2 text-5xl font-bold text-white">
               Create <Text className="text-pink-400">T3</Text> Turbo
            </Text>
            <Text className="mx-auto pb-2 text-5xl font-bold text-white">
               tRPC {JSON.stringify(trpc.data)}
            </Text>
         </View>
      </SafeAreaView>
   );
};

export default Page;
