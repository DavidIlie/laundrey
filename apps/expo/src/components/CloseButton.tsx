import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const CloseButton: React.FC = () => {
   const router = useRouter();
   return (
      <TouchableOpacity onPress={() => router.back()}>
         <Text>Close</Text>
      </TouchableOpacity>
   );
};

export default CloseButton;
