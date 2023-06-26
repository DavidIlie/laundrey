import React from "react";
import type { TouchableOpacityProps } from "react-native";
import { TouchableOpacity } from "react-native";

const Button = React.forwardRef<TouchableOpacity, TouchableOpacityProps>(
   (props, ref) => (
      <TouchableOpacity
         {...props}
         ref={ref}
         className={`${props.className} inline-flex h-10 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium disabled:pointer-events-none disabled:opacity-50`}
      >
         {props.children}
      </TouchableOpacity>
   ),
);

Button.displayName = "Button";

export default Button;
