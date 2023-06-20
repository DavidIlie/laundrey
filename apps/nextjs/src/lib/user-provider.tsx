"use client";

import React, {
   createContext,
   useContext,
   useEffect,
   useMemo,
   useState,
} from "react";
import { getCookie } from "cookies-next";

import type { User } from "@laundrey/api/client";

type UpdateSession = (data?: User) => User;

export type UserContextValue<R extends boolean = false> = R extends true
   ?
        | { update: UpdateSession; user: User; status: "authenticated" }
        | { update: UpdateSession; user: null; status: "loading" }
   :
        | { update: UpdateSession; user: User; status: "authenticated" }
        | {
             update: UpdateSession;
             user: null;
             status: "unauthenticated" | "loading";
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
         "[next-auth]: `useSession` must be wrapped in a <SessionProvider />",
      );
   }

   return value as UserContextValue;
};

export type UserProviderProps = {
   children: React.ReactNode;
   user?: User;
   refetchOnWindowFocus?: boolean;
};

export const UserProvider = (props: UserProviderProps) => {
   if (!UserContext) {
      throw new Error("React Context is unavailable in Server Components");
   }

   const hasInitialSession = props.user !== undefined;

   const [user, setUser] = useState(props.user);

   const [loading, setLoading] = useState(!hasInitialSession);

   const getSession = async () => {
      const cookie = getCookie("access");
      if (!cookie) return;
      try {
         const r = await fetch("/api/trpc/user.session", {
            credentials: "include",
         });
         const response = (await r.json()) as {
            result: { data: { json: User } };
         };
         if (!response.result.data.json) throw new Error("failed request");
         setUser(response.result.data.json);
         if (process.env.NODE_ENV)
            console.log("GET_SESSION", response.result.data.json.id);
      } catch (error) {
         if (process.env.NODE_ENV) console.error("GET_SESSION_FAIL", error);
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
   }, []);

   const { refetchOnWindowFocus = true } = props;

   useEffect(() => {
      const visibilityHandler = () => {
         if (refetchOnWindowFocus && document.visibilityState === "visible") {
            void getSession();
         }
      };

      document.addEventListener("visibilitychange", visibilityHandler, false);

      return () =>
         document.removeEventListener(
            "visibilitychange",
            visibilityHandler,
            false,
         );
   }, [refetchOnWindowFocus]);

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const value: any = useMemo(
      () => ({
         user: user,
         status: loading
            ? "loading"
            : user
            ? "authenticated"
            : "unauthenticated",
         update(data: User) {
            setUser(data);
         },
      }),
      [user, loading],
   );

   return (
      <UserContext.Provider value={value as UserContextValue}>
         {props.children}
      </UserContext.Provider>
   );
};