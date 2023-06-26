import type { ExpoConfig } from "@expo/config";

const defineConfig = (): ExpoConfig => ({
   name: "expo",
   slug: "expo",
   scheme: "expo",
   version: "1.0.0",
   orientation: "portrait",
   icon: "./assets/icon.png",
   userInterfaceStyle: "light",
   splash: {
      image: "./assets/icon.png",
      resizeMode: "contain",
      backgroundColor: "#1f2937",
   },
   updates: {
      fallbackToCacheTimeout: 0,
   },
   assetBundlePatterns: ["**/*"],
   ios: {
      supportsTablet: true,
      bundleIdentifier: "dev.davidapps.laundrey",
   },
   android: {
      adaptiveIcon: {
         foregroundImage: "./assets/icon.png",
         backgroundColor: "#1f2937",
      },
   },
   extra: {
      eas: {
         // projectId: "your-project-id",
      },
   },
   plugins: ["./expo-plugins/with-modify-gradle.js"],
});

export default defineConfig;
