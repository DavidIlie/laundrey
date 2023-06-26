import React from "react";
import { Text } from "react-native";

const Logo: React.FC<{ classes?: string }> = ({ classes }) => {
   return (
      <Text className={`font-bold text-blue-500 ${classes}`}>
         Laund
         <Text className={`font-bold text-red-500 ${classes}`}>rey</Text>
      </Text>
   );
};

export default Logo;
