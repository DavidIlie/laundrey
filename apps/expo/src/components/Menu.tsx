import React from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import UserAvatar from "react-native-user-avatar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useSession } from "~/lib/auth";

export const LeftMenu: React.FC = () => {
   return (
      <TouchableOpacity>
         <MaterialCommunityIcons name="cog" size={26} color="black" />
      </TouchableOpacity>
   );
};

export const RightMenu: React.FC = () => {
   const { user } = useSession();
   const router = useRouter();

   return (
      <TouchableOpacity onPress={() => router.push("/profile")}>
         <UserAvatar size={28} name={user.name} src={user.image} />
      </TouchableOpacity>
   );
};
