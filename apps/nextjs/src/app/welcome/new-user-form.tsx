"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TRPCError } from "@trpc/server";
import { setCookie } from "cookies-next";
import type { z } from "zod";

import { api } from "~/trpc/client";
import { useSession } from "~/lib/user-provider";
import { useZodForm } from "~/lib/zod-form";

import { getMaxAge } from "@laundrey/api/client";
import { newAdminUserValidator } from "@laundrey/api/validators";
import { Button } from "@laundrey/ui/button";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@laundrey/ui/form";
import { Spinner } from "@laundrey/ui/icons";
import { Input } from "@laundrey/ui/input";
import { useToast } from "@laundrey/ui/use-toast";

const NewUserForm: React.FC = () => {
   const [loading, setLoading] = useState(false);
   const form = useZodForm({ schema: newAdminUserValidator });
   const { toast } = useToast();
   const { update } = useSession();
   const router = useRouter();

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(
               async (values: z.infer<typeof newAdminUserValidator>) => {
                  setLoading(true);
                  try {
                     const mutation = await api.user.createFirstUser.mutate(
                        values,
                     );
                     if (mutation instanceof TRPCError) return;
                     form.reset();
                     const maxAge = getMaxAge(false);
                     setCookie("access", mutation.accessToken, { maxAge });
                     update(mutation.session);
                     router.push("/app");
                     setLoading(false);
                  } catch (error) {
                     setLoading(false);
                     return toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description:
                           (error as TRPCError).message ||
                           "There was a problem with your request.",
                     });
                  }
               },
            )}
            className="space-y-2"
         >
            <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Name</FormLabel>
                     <FormControl>
                        <Input type="text" {...field} />
                     </FormControl>
                     <FormDescription>
                        This is the name associated to your account
                     </FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="email"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Email</FormLabel>
                     <FormControl>
                        <Input type="email" {...field} />
                     </FormControl>
                     <FormDescription>
                        This is the email associated to your account.
                     </FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="password"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Password</FormLabel>
                     <FormControl>
                        <Input type="password" {...field} />
                     </FormControl>
                     <FormDescription>
                        This is the password associated to your account
                     </FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <Button
               type="submit"
               disabled={loading}
               className="flex items-center gap-2"
            >
               {loading && <Spinner className="animate-spin" />}
               {loading ? "Creating Account" : "Create Account"}
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
               You can always modify this later.
            </p>
         </form>
      </Form>
   );
};

export default NewUserForm;
