import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Page = () => {
   return (
      <SafeAreaView className="h-screen w-full">
         <View>
            <Text>Laundrey</Text>
            <View></View>
            <TouchableOpacity>
               <Text>Use custom server URL</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};

export default Page;
