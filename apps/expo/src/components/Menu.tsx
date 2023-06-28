import React from "react";
import { Text, TouchableOpacity } from "react-native";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import UserAvatar from "react-native-user-avatar";
import { usePathname, useRouter } from "expo-router";

import { useSession } from "~/lib/auth";

export const RightMenu: React.FC = () => {
   const { user, status } = useSession();
   const router = useRouter();
   const pathname = usePathname();

   const isInProfile = pathname === "/profile";

   return (
      <TouchableOpacity
         onPress={() => {
            if (isInProfile) return router.back();
            router.push("/profile");
         }}
      >
         {isInProfile ? (
            <Text>Close</Text>
         ) : (
            status === "authenticated" && (
               <UserAvatar size={28} name={user.name} src={user.image} />
            )
         )}
      </TouchableOpacity>
   );
};
