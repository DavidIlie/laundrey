import React from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller } from "react-hook-form";

import { api } from "~/lib/api";

import { useZodForm } from "@laundrey/api/form";
import { loginValidator } from "@laundrey/api/validators";

import { FormItem, FormMessage } from "~/components/form";
import Input from "~/components/Input";
import Label from "~/components/Label";
import Logo from "~/components/Logo";

const Page = () => {
   const form = useZodForm({ schema: loginValidator });

   const loginMutation = api.user.login.useMutation();

   return (
      <>
         <SafeAreaView className="flex h-screen w-full items-center justify-center">
            <View>
               <Logo classes="text-2xl text-center" />
               <Text className="text-xs text-gray-500">
                  You need to log in in order to use Laundrey
               </Text>
               <View className="my-2" />
               <Controller
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                     <FormItem>
                        <Label>Email</Label>
                        <Input {...field} autoCapitalize="none" />
                        <FormMessage error={form.formState.errors.email} />
                     </FormItem>
                  )}
               />
               {form.formState.errors.email && (
                  <Text className="text-red-500">
                     {form.formState.errors.email.message}
                  </Text>
               )}
               <Controller
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                     <FormItem>
                        <Label>Password</Label>
                        <Input
                           {...field}
                           autoCapitalize="none"
                           secureTextEntry
                        />
                        <FormMessage error={form.formState.errors.password} />
                     </FormItem>
                  )}
               />
               {form.formState.errors.password && (
                  <Text className="text-red-500">
                     {form.formState.errors.password.message}
                  </Text>
               )}
               <Button
                  title="Submit"
                  onPress={form.handleSubmit(async (values) => {
                     console.log(values);
                  })}
               />
            </View>
         </SafeAreaView>
      </>
   );
};

export default Page;
