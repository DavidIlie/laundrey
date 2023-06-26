import React from "react";
import type { TextProps } from "react-native";
import { Text } from "react-native";

const Label = React.forwardRef<Text, TextProps>((props, ref) => (
   <Text ref={ref} className="text-sm font-medium" {...props}>
      {props.children}
   </Text>
));

Label.displayName = "Label";

export default Label;
