"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { TRPCError } from "@trpc/server";

import { api } from "~/trpc/client";
import { useZodForm } from "~/lib/zod-form";

import { brandAndCategoryValidator } from "@laundrey/api/validators";
import type { Brand } from "@laundrey/db";
import { Button } from "@laundrey/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@laundrey/ui/form";
import { Spinner } from "@laundrey/ui/icons";
import { Input } from "@laundrey/ui/input";
import {
   Sheet as ImportedSheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@laundrey/ui/sheet";
import { useToast } from "@laundrey/ui/use-toast";

const Sheet: React.FC<{ initial?: Brand; children: React.ReactNode }> = ({
   initial,
   children,
}) => {
   const [loading, setLoading] = useState(false);
   const { toast } = useToast();
   const router = useRouter();

   const form = useZodForm(
      initial
         ? {
              schema: brandAndCategoryValidator,
              defaultValues: {
                 name: initial.name,
                 description: initial.description || "",
              },
           }
         : { schema: brandAndCategoryValidator },
   );

   return (
      <ImportedSheet>
         <SheetTrigger asChild>{children}</SheetTrigger>
         <SheetContent>
            <SheetHeader>
               <SheetTitle>
                  {initial ? `Update "${initial.name}"` : "New Brand"}
               </SheetTitle>
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(async (values) => {
                        try {
                           setLoading(true);

                           if (initial) {
                              await api.brands.update.mutate({
                                 ...values,
                                 id: initial.id,
                              });
                           } else {
                              await api.brands.create.mutate(values);
                           }

                           router.refresh();

                           setLoading(false);
                        } catch (error) {
                           return toast({
                              variant: "destructive",
                              title: "Uh oh! Something went wrong.",
                              description:
                                 (error as TRPCError).message ??
                                 "There was a problem with your request.",
                           });
                        }
                     })}
                     className="space-y-3"
                  >
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                 <Input {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                 <Input {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <Button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2"
                     >
                        {loading && <Spinner className="animate-spin" />}
                        {loading
                           ? initial
                              ? "Updating"
                              : "Creating"
                           : initial
                           ? "Update"
                           : "Create"}
                     </Button>
                  </form>
               </Form>
            </SheetHeader>
         </SheetContent>
      </ImportedSheet>
   );
};

export default Sheet;
