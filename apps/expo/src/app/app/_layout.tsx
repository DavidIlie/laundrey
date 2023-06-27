import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { RightMenu } from "~/components/Menu";

export default function layout() {
   return (
      <Tabs
         screenOptions={{
            headerShown: false,
         }}
      >
         <Tabs.Screen
            name="index"
            options={{
               title: "Dashboard",
               tabBarIcon: () => (
                  <Feather name="home" size={24} color="black" />
               ),
            }}
         />
         <Tabs.Screen
            name="laundry"
            options={{
               title: "Laundry",
               tabBarIcon: () => (
                  <Ionicons name="shirt-outline" size={24} color="black" />
               ),
            }}
         />
         <Tabs.Screen
            name="clothes"
            options={{
               title: "Clothes",
               tabBarIcon: () => (
                  <MaterialIcons
                     name="local-laundry-service"
                     size={24}
                     color="black"
                  />
               ),
            }}
         />
      </Tabs>
   );
}
