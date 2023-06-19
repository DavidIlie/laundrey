"use client";

import { Form } from "react-hook-form";

import { useZodForm } from "~/lib/zod-form";

import { newUserValidator } from "@laundrey/api/validators";
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

const NewUserForm: React.FC = () => {
   const form = useZodForm({ schema: newUserValidator });

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(() => {
               console.log("hi");
            })}
            className="space-y-4"
         >
            <FormField
               control={form.control}
               name="email"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Email</FormLabel>
                     <FormControl>
                        <Input placeholder="shadcn" type="email" {...field} />
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
   );
};

export default NewUserForm;
