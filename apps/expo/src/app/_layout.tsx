import React, { useEffect, useState } from "react";
import Dialog from "react-native-dialog";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import Constants from "expo-constants";
import { SplashScreen, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/lib/api";
import { UserProvider } from "~/lib/auth";
import { ACCESS_KEY, API_KEY } from "~/lib/constants";

import { LoadingOverlay } from "~/components/LoadingOverlay";
import { RightMenu } from "~/components/Menu";

const RootLayout = () => {
   const [needApiUrl, setNeedApiUrl] = useState(false);
   const [inputtedApiUrl, setInputtedApiUrl] = useState("");
   const [apiUrl, setApiUrl] = useState("");

   useEffect(() => {
      const getData = async () => {
         // await SecureStore.deleteItemAsync(API_KEY);
         // await SecureStore.deleteItemAsync(ACCESS_KEY);
         SplashScreen.hideAsync();
         const attempt = await SecureStore.getItemAsync(API_KEY);
         if (attempt) return setApiUrl(attempt);

         setNeedApiUrl(true);
      };

      void getData();
   }, []);

   useEffect(() => {
      if (apiUrl !== "") {
         setNeedApiUrl(false);
      }
   }, [apiUrl]);

   if (needApiUrl)
      return (
         <Dialog.Container visible={true}>
            <Dialog.Title>API Link</Dialog.Title>
            <Dialog.Input
               placeholder="https://laundrey.davidapps.dev"
               onChangeText={(t) => setInputtedApiUrl(t)}
               autoCapitalize="none"
               autoCorrect={false}
            />
            <Dialog.Button
               label="Enter"
               onPress={async () => {
                  //asume it's a URL otherwise the app will fail
                  await SecureStore.setItemAsync(API_KEY, inputtedApiUrl);
                  setNeedApiUrl(false);
                  setInputtedApiUrl("");
                  return setApiUrl(inputtedApiUrl);
               }}
            />
            {__DEV__ ? (
               <Dialog.Button
                  label="Use local"
                  onPress={async () => {
                     const localhost =
                        Constants.manifest?.debuggerHost?.split(":")[0];
                     if (localhost) {
                        const url = `http://${localhost}:3000`;
                        await SecureStore.setItemAsync(API_KEY, url);
                        setApiUrl(url);
                     }
                  }}
               />
            ) : (
               <Dialog.Button
                  label="Use public"
                  onPress={async () => {
                     const url = `https://laundrey.davidapps.dev`;
                     await SecureStore.setItemAsync(API_KEY, url);
                     setApiUrl(url);
                  }}
               />
            )}
         </Dialog.Container>
      );

   return (
      <TRPCProvider apiUrl={apiUrl}>
         <LoadingOverlay>
            <UserProvider>
               <SafeAreaProvider>
                  <ActionSheetProvider>
                     <Stack
                        screenOptions={{
                           headerRight: RightMenu,
                           title: "Laundrey",
                        }}
                     >
                        <Stack.Screen name="(app)" />
                        <Stack.Screen
                           name="signin"
                           options={{ headerShown: false }}
                        />
                        <Stack.Screen
                           name="profile"
                           options={{ presentation: "modal", title: "Profile" }}
                        />
                     </Stack>
                  </ActionSheetProvider>
                  <StatusBar />
               </SafeAreaProvider>
            </UserProvider>
         </LoadingOverlay>
      </TRPCProvider>
   );
};

export default RootLayout;
