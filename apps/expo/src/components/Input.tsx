import React from "react";
import { TextInput } from "react-native";
import type { TextInputProps } from "react-native";

const Input = React.forwardRef<TextInput, TextInputProps>(
   ({ onChange, ...rest }, ref) => (
      <TextInput
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         //@ts-ignore
         onChangeText={onChange}
         {...rest}
         ref={ref}
         className="flex h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background disabled:opacity-50"
      />
   ),
);

Input.displayName = "Input";

export default Input;
