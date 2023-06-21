"use client";

import type { z } from "zod";

import { useZodForm } from "~/lib/zod-form";

import { categoryValidator } from "@laundrey/api/validators";
import type { Category } from "@laundrey/db";
import { cn } from "@laundrey/ui";
import { Button } from "@laundrey/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@laundrey/ui/form";
import { Check, Down } from "@laundrey/ui/icons";
import { Input } from "@laundrey/ui/input";

//TODO: https://github.com/mxkaske/mxkaske.dev/blob/main/components/craft/fancy-multi-select.tsx

const CreateForm: React.FC<{ categories: Category[] }> = ({
   categories: serverFedCategories,
}) => {
   const form = useZodForm({
      schema: categoryValidator,
   });

   const categories = serverFedCategories.map((cat) => ({
      label: cat.name,
      value: cat.id,
   }));

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(
               async (values: z.infer<typeof categoryValidator>) => {
                  console.log(values);
               },
            )}
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
            <FormField
               control={form.control}
               name="category"
               render={({ field }) => (
                  <FormItem className="flex flex-col">
                     <FormLabel>Category</FormLabel>
                     <FormControl></FormControl>
                  </FormItem>
               )}
            />
            <Button type="submit">Create</Button>
         </form>
      </Form>
   );
};

export default CreateForm;
