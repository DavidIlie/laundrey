import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Page = () => {
   return (
      <SafeAreaView className="h-screen w-full">
         <View>
            <Text>Laundrey</Text>
            <View></View>
            <Pressable>
               <Text>Use custom server URL</Text>
            </Pressable>
         </View>
      </SafeAreaView>
   );
};

export default Page;
