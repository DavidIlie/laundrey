import React, {
   createContext,
   useContext,
   useEffect,
   useMemo,
   useState,
} from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

import type { User } from "@laundrey/api/client";
import type { BaseUser } from "@laundrey/api/src/lib/session-user";

import Button from "~/components/Button";
import { LoadingOverlayElement } from "~/components/LoadingOverlay";
import { ACCESS_KEY, API_KEY } from "./constants";

type UpdateSession = (data?: User) => User;

export type UserContextValue = {
   update: UpdateSession;
   user: BaseUser;
   status: "authenticated" | "unauthenticated" | "loading";
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
   const router = useRouter();

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
            router.push("/signin");
         },
      }),
      [user, loading, router],
   );

   if (loading && !user) return <LoadingOverlayElement />;

   return (
      <UserContext.Provider value={value as UserContextValue}>
         {props.children}
      </UserContext.Provider>
   );
};
