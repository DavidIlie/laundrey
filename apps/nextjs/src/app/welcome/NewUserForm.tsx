"use client";

import { redirect } from "next/navigation";
import { TRPCError } from "@trpc/server";
import { Form } from "react-hook-form";
import type { z } from "zod";

import { useZodForm } from "~/lib/zod-form";

import { newAdminUserValidator } from "@laundrey/api/validators";
import { Button } from "@laundrey/ui/button";
import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@laundrey/ui/form";
import { Input } from "@laundrey/ui/input";

import { api } from "~/trpc/server";

const NewUserForm: React.FC = () => {
   const form = useZodForm({ schema: newAdminUserValidator });

   return (
      <>
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(
                  async (values: z.infer<typeof newAdminUserValidator>) => {
                     const mutation = await api.user.createFirstUser.mutate(
                        values,
                     );
                     if (mutation instanceof TRPCError) alert("error");
                     redirect("/");
                  },
               )}
               className="space-y-4"
            >
               <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="Email address"
                              type="email"
                              {...field}
                           />
                        </FormControl>
                        <FormDescription>
                           This is the email associated to your account.
                        </FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Button type="submit">Submit</Button>
            </form>
         </Form>
      </>
   );
};

export default NewUserForm;
