import React, {
   createContext,
   useContext,
   useEffect,
   useMemo,
   useState,
} from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { Controller } from "react-hook-form";

import { api } from "~/lib/api";

import type { User } from "@laundrey/api/client";
import { useZodForm } from "@laundrey/api/form";
import { loginValidator } from "@laundrey/api/validators";

import Button from "~/components/Button";
import { FormItem, FormMessage } from "~/components/form";
import Input from "~/components/Input";
import Label from "~/components/Label";
import Logo from "~/components/Logo";
import { ACCESS_KEY, API_KEY } from "./constants";

type UpdateSession = (data?: User) => User;

export type UserContextValue<R extends boolean = false> = R extends true
   ?
        | {
             update: UpdateSession;
             user: User;
             status: "authenticated";
             signOut: () => void;
          }
        | {
             update: UpdateSession;
             user: null;
             status: "loading";
             signOut: () => void;
          }
   :
        | {
             update: UpdateSession;
             user: User;
             status: "authenticated";
             signOut: () => void;
          }
        | {
             update: UpdateSession;
             user: null;
             status: "unauthenticated" | "loading";
             signOut: () => void;
          };

export const UserContext = createContext<UserContextValue | undefined>(
   undefined,
);

export const useSession = (): UserContextValue => {
   if (!UserContext) {
      throw new Error("React Context is unavailable in Server Components");
   }

   // @ts-expect-error Satisfy TS if branch on line below
   const value: SessionContextValue<R> = useContext(UserContext);
   if (!value && process.env.NODE_ENV !== "production") {
      throw new Error(
         "[auth]: `useSession` must be wrapped in a <SessionProvider />",
      );
   }

   return value as UserContextValue;
};

const fetchSession = async () => {
   console.log("hey");
   const apiURL = await SecureStore.getItemAsync(API_KEY);
   const accessKey = await SecureStore.getItemAsync(ACCESS_KEY);
   const r = await fetch(`${apiURL}/api/trpc/user.session`, {
      headers: {
         access: accessKey || "",
      },
   });
   const response = (await r.json()) as {
      result: { data: { json: User } };
   };
   if (!response.result.data.json) throw new Error("failed request");
   return response.result.data.json;
};

export type UserProviderProps = {
   children: React.ReactNode;
};

export const UserProvider = (props: UserProviderProps) => {
   const [user, setUser] = useState<User | null>();
   const [loading, setLoading] = useState(false);

   const getSession = async () => {
      const accessKey = await SecureStore.getItemAsync(ACCESS_KEY);
      if (!accessKey || loading) return;
      try {
         setLoading(true);
         const session = await fetchSession();
         setUser(session);
         if (__DEV__) console.log("GET_SESSION", session.id);
         setLoading(false);
      } catch (error) {
         setUser(null);
         if (__DEV__) console.error("GET_SESSION_FAIL", error);
      }
   };

   useEffect(() => {
      const work = async () => {
         try {
            await getSession();
         } catch (error) {
            console.error("CLIENT_SESSION_ERROR");
         } finally {
            setLoading(false);
         }
      };
      void work();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const value: any = useMemo(
      () => ({
         user: user,
         status: loading
            ? "loading"
            : user
            ? "authenticated"
            : "unauthenticated",
         update(data: User | null) {
            setUser(data);
         },
         async signOut() {
            await SecureStore.deleteItemAsync(ACCESS_KEY);
            setUser(null);
         },
      }),
      [user, loading],
   );

   if (loading && !user) return <View />;

   return (
      <UserContext.Provider value={value as UserContextValue}>
         {!user ? <Login /> : props.children}
      </UserContext.Provider>
   );
};

const Login = () => {
   const form = useZodForm({
      schema: loginValidator,
      defaultValues: { remember: false },
   });

   const loginMutation = api.user.login.useMutation();

   const { update } = useSession();

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
                     const res = await loginMutation.mutateAsync(values);
                     await SecureStore.setItemAsync(
                        ACCESS_KEY,
                        res.accessToken,
                     );
                     update(res.session);
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
