import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { Controller } from "react-hook-form";

import { api } from "~/lib/api";
import { useSession } from "~/lib/auth";
import { ACCESS_KEY, API_KEY } from "~/lib/constants";

import { useZodForm } from "@laundrey/api/form";
import { loginValidator } from "@laundrey/api/validators";

import Button from "~/components/Button";
import { FormItem, FormMessage } from "~/components/form";
import Input from "~/components/Input";
import Label from "~/components/Label";
import { useLoadingStore } from "~/components/LoadingOverlay";
import Logo from "~/components/Logo";

const Login = () => {
   const form = useZodForm({
      schema: loginValidator,
      defaultValues: { remember: false },
   });

   const loginMutation = api.user.login.useMutation();

   const { update } = useSession();

   const { toggleLoading } = useLoadingStore();

   return (
      <SafeAreaView className="flex h-screen w-full items-center justify-center">
         <View>
            <Logo classes="text-2xl" />
            <Text className="text-xs text-gray-500">
               You need to log in in order to use Laundrey
            </Text>
            <View className="my-2" />
            <View className="space-y-3">
               <Controller
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                     <FormItem>
                        <Label>Email</Label>
                        <Input
                           {...field}
                           autoCapitalize="none"
                           textContentType="emailAddress"
                        />
                        <FormMessage error={form.formState.errors.email} />
                     </FormItem>
                  )}
               />
               <View className="-my-1" />
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
                           textContentType="password"
                        />
                        <FormMessage error={form.formState.errors.password} />
                     </FormItem>
                  )}
               />
               <Button
                  onPress={form.handleSubmit(async (values) => {
                     toggleLoading();
                     const res = await loginMutation.mutateAsync(values);
                     await SecureStore.setItemAsync(
                        ACCESS_KEY,
                        res.accessToken,
                     );
                     update(res.session);
                     toggleLoading();
                  })}
               >
                  <Text>Log In</Text>
               </Button>
            </View>
            <Button
               className="mt-2 bg-blue-500/20"
               onPress={async () => {
                  await SecureStore.deleteItemAsync(API_KEY);
               }}
            >
               <Text>Reset API URL</Text>
            </Button>
         </View>
      </SafeAreaView>
   );
};

export default Login;
