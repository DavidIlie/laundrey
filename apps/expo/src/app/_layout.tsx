import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "../lib/api";

const RootLayout = () => {
   return (
      <TRPCProvider>
         <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }} />
            <StatusBar />
         </SafeAreaProvider>
      </TRPCProvider>
   );
};

export default RootLayout;
