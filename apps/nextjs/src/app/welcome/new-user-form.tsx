"use client";

import { useRouter } from "next/navigation";
import { TRPCError } from "@trpc/server";
import { setCookie } from "cookies-next";
import type { z } from "zod";

import { api } from "~/trpc/client";
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
import { Input } from "@laundrey/ui/input";
import { useToast } from "@laundrey/ui/use-toast";

import { useSession } from "~/components/user-provider";

const NewUserForm: React.FC = () => {
   const form = useZodForm({ schema: newAdminUserValidator });
   const { toast } = useToast();
   const router = useRouter();
   const { update } = useSession();

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(
               async (values: z.infer<typeof newAdminUserValidator>) => {
                  const mutation = await api.user.createFirstUser.mutate(
                     values,
                  );
                  if (mutation instanceof TRPCError)
                     return toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description: "There was a problem with your request.",
                     });
                  form.reset();
                  const maxAge = getMaxAge(false);
                  setCookie("access", mutation.accessToken, { maxAge });
                  update(mutation.session);
                  router.push("/");
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
            <Button type="submit">Create Account</Button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
               You can always modify this later.
            </p>
         </form>
      </Form>
   );
};

export default NewUserForm;
