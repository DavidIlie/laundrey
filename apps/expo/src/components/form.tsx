import React from "react";
import type { TextProps, ViewProps } from "react-native";
import { Text, View } from "react-native";
import type { FieldError } from "react-hook-form";

const FormItem = React.forwardRef<View, ViewProps>((props, ref) => (
   <View className="space-y-1" {...props} ref={ref}>
      {props.children}
   </View>
));

FormItem.displayName = "FormItem";

const FormMessage = React.forwardRef<
   Text,
   TextProps & { error: FieldError | undefined }
>(
   (props, ref) =>
      props.error && (
         <Text
            className="text-sm font-medium text-red-500"
            {...props}
            ref={ref}
         >
            {props.error.message}
         </Text>
      ),
);

FormMessage.displayName = "FormMessage";

export { FormItem, FormMessage };
