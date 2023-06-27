import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSession } from "~/lib/auth";

const Page = () => {
   const { user, signOut } = useSession();

   return (
      <SafeAreaView>
         <Text>Hi, {user.email}</Text>
         <TouchableOpacity onPress={() => signOut()}>
            <Text>Log out</Text>
         </TouchableOpacity>
      </SafeAreaView>
   );
};

export default Page;
