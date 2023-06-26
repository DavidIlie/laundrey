import React from "react";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useZodForm } from "@laundrey/api/form";
import { loginValidator } from "@laundrey/api/validators";

import Logo from "~/components/Logo";

const Page = () => {
   const form = useZodForm({ schema: loginValidator });
   return (
      <>
         <SafeAreaView className="flex h-screen w-full items-center justify-center">
            <View>
               <Logo classes="text-2xl text-center" />
               <Text className="text-xs text-gray-500">
                  You need to log in in order to use Laundrey
               </Text>
               <View>
                  <TextInput />
               </View>
            </View>
         </SafeAreaView>
      </>
   );
};

export default Page;
