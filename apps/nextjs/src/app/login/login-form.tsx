"use client";

import { useRouter } from "next/navigation";
import { TRPCError } from "@trpc/server";
import { setCookie } from "cookies-next";
import type { z } from "zod";

import { api } from "~/trpc/client";
import { useSession } from "~/lib/user-provider";
import { useZodForm } from "~/lib/zod-form";

import { getMaxAge } from "@laundrey/api/client";
import { loginValidator } from "@laundrey/api/validators";
import { Button } from "@laundrey/ui/button";
import { Checkbox } from "@laundrey/ui/checkbox";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@laundrey/ui/form";
import { Input } from "@laundrey/ui/input";
import { Label } from "@laundrey/ui/label";
import { useToast } from "@laundrey/ui/use-toast";

const LogInForm: React.FC = () => {
   const form = useZodForm({
      schema: loginValidator,
      defaultValues: { remember: false },
   });
   const { toast } = useToast();
   const router = useRouter();
   const { update } = useSession();

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(
               async (values: z.infer<typeof loginValidator>) => {
                  try {
                     const mutation = await api.user.login.mutate(values);
                     if (mutation instanceof TRPCError) return;
                     form.reset();
                     const maxAge = getMaxAge(values.remember);
                     setCookie("access", mutation.accessToken, { maxAge });
                     update(mutation.session);
                     router.push("/app");
                  } catch (error) {
                     return toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description:
                           (error as TRPCError).message ??
                           "There was a problem with your request.",
                     });
                  }
               },
            )}
            className="space-y-3"
         >
            <FormField
               control={form.control}
               name="email"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Email</FormLabel>
                     <FormControl>
                        <Input type="email" {...field} />
                     </FormControl>
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
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="remember"
               render={({ field }) => (
                  <FormItem>
                     <div className="flex items-center gap-1">
                        <FormControl>
                           <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                           />
                        </FormControl>
                        <Label>Remember Me</Label>
                     </div>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <Button type="submit">Log In</Button>
         </form>
      </Form>
   );
};

export default LogInForm;
