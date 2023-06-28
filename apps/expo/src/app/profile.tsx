import React from "react";
import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";

import { useSession } from "~/lib/auth";

import Button from "~/components/Button";

const Profile: React.FC = () => {
   const { signOut } = useSession();
   const { colorScheme } = useColorScheme();
   return (
      <View className="mt-4 space-y-2 px-2">
         <Button>
            <Text>Report a bug</Text>
         </Button>
         <Button>
            <Text>{colorScheme === "dark" ? "Light" : "Dark"} Mode</Text>
         </Button>
         <Text className="text-xl font-medium">My Account</Text>
         <Button onPress={() => signOut()}>
            <Text>Log Out</Text>
         </Button>
         <Text className="italic text-gray-500">
            More profile stuff coming soon
         </Text>
         <StatusBar style="light" />
      </View>
   );
};

export default Profile;
