import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useSession } from "~/lib/auth";

const Page = () => {
   const { user, signOut } = useSession();

   return (
      <View className="mt-1 px-2">
         <Text>Hi, {user.email}</Text>
      </View>
   );
};

export default Page;
