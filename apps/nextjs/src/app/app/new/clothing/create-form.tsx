"use client";

import type { z } from "zod";

import { useZodForm } from "~/lib/zod-form";

import { categoryValidator } from "@laundrey/api/validators";
import type { Category } from "@laundrey/db";
import { Button } from "@laundrey/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@laundrey/ui/form";
import { Input } from "@laundrey/ui/input";
import { MultiSelect } from "@laundrey/ui/multiselect";

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
                  <FormItem>
                     <FormLabel>Category</FormLabel>
                     <FormControl>
                        <MultiSelect
                           data={categories}
                           placeholder="Select categories..."
                           {...field}
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <Button type="submit">Create</Button>
         </form>
      </Form>
   );
};

export default CreateForm;
