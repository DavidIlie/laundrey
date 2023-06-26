"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { TRPCError } from "@trpc/server";
import type { z } from "zod";

import type { RouterOutputs } from "~/trpc/client";
import { api } from "~/trpc/client";

import { useZodForm } from "@laundrey/api/form";
import {
   clientPhotoValidator,
   clothingValidator,
} from "@laundrey/api/validators";
import { cn } from "@laundrey/ui";
import { Button } from "@laundrey/ui/button";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
} from "@laundrey/ui/command";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@laundrey/ui/form";
import { Check, Spinner } from "@laundrey/ui/icons";
import { Input } from "@laundrey/ui/input";
import { Label } from "@laundrey/ui/label";
import { MultiSelect } from "@laundrey/ui/multiselect";
import { Popover, PopoverContent, PopoverTrigger } from "@laundrey/ui/popover";
import { useToast } from "@laundrey/ui/use-toast";

const joinedValidator = clothingValidator.and(clientPhotoValidator);

const CreateForm: React.FC<{
   categories: RouterOutputs["categories"]["all"];
   brands: RouterOutputs["brands"]["all"];
}> = ({ categories: serverFedCategories, brands: serverFedBrands }) => {
   const { toast } = useToast();
   const router = useRouter();
   const [loading, setLoading] = useState(false);

   const form = useZodForm({
      schema: joinedValidator,
      defaultValues: {
         quantity: 1,
      },
   });

   const watchPhotos = form.watch("photos");

   const categories = serverFedCategories.map((cat) => ({
      label: cat.name,
      value: cat.id,
   }));

   const brands = serverFedBrands.map((cat) => ({
      label: cat.name,
      value: cat.id,
   }));

   const buttonContent = (
      <div className="flex w-full items-center justify-center gap-2 text-center">
         {loading && <Spinner className="animate-spin" />}
         {loading ? "Creating" : "Create"}
      </div>
   );

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(
               async (values: z.infer<typeof joinedValidator>) => {
                  try {
                     setLoading(true);
                     const mutation = await api.clothes.create.mutate({
                        name: values.name,
                        brand: values.brand,
                        category: values.category,
                        quantity: values.quantity,
                        photos: values.photos?.map((s) => s.name),
                     });

                     if (Array.isArray(mutation)) {
                        await Promise.all(
                           mutation.map(async (s) => {
                              const file = values.photos!.filter(
                                 (b) => b.name === s.fileName,
                              )[0]!;

                              const formData = new FormData();
                              formData.append("Content-Type", file.type);

                              Object.entries({
                                 ...s.formData,
                                 file: file,
                              }).forEach(([key, value]) => {
                                 formData.append(key, value as Blob);
                              });

                              const upload = await fetch(s.postURL, {
                                 method: "POST",
                                 body: formData,
                                 headers: new Headers({
                                    Accept: "application/xml",
                                 }),
                              });

                              if (!upload.ok) throw new Error("Upload failed.");

                              console.log("UPLOAD SUCCESSFUL", file.name);
                           }),
                        );
                     }
                     setLoading(false);
                     form.reset();
                     router.push("/app/clothes");
                     toast({
                        title: "Clothing",
                        description: "Created successfully!",
                     });
                  } catch (error) {
                     setLoading(false);
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
            className="justify-evenly gap-4 lg:flex"
         >
            <div className="space-y-3 lg:w-3/5">
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
                  name="brand"
                  render={({ field }) => (
                     <FormItem className="flex flex-col">
                        <FormLabel>Brand</FormLabel>
                        <Popover>
                           <PopoverTrigger asChild>
                              <FormControl>
                                 <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                       "justify-between bg-white dark:bg-gray-800",
                                       !field.value && "text-muted-foreground",
                                    )}
                                 >
                                    {field.value &&
                                       brands.find(
                                          (brand) =>
                                             brand.value === field.value,
                                       )?.label}
                                 </Button>
                              </FormControl>
                           </PopoverTrigger>
                           <PopoverContent className="w-[300px] p-0">
                              <Command>
                                 <CommandInput placeholder="Search brands..." />
                                 <CommandEmpty>No brand found.</CommandEmpty>
                                 <CommandGroup>
                                    {brands.map((brand) => (
                                       <CommandItem
                                          value={brand.value}
                                          key={brand.value}
                                          onSelect={(value) => {
                                             form.setValue("brand", value);
                                          }}
                                       >
                                          <Check
                                             className={cn(
                                                "mr-2 h-4 w-4",
                                                brand.value === field.value
                                                   ? "opacity-100"
                                                   : "opacity-0",
                                             )}
                                          />
                                          {brand.label}
                                       </CommandItem>
                                    ))}
                                 </CommandGroup>
                              </Command>
                           </PopoverContent>
                        </Popover>
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
                           <MultiSelect data={categories} {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field: { onChange, ...rest } }) => (
                     <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                           <Input
                              type="number"
                              onChange={(e) =>
                                 onChange(parseInt(e.target.value))
                              }
                              {...rest}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Button
                  type="submit"
                  className="hidden w-full lg:block"
                  disabled={loading}
               >
                  {buttonContent}
               </Button>
            </div>
            <div className="my-3 lg:my-0 lg:w-2/5">
               <FormField
                  control={form.control}
                  name="photos"
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                     <FormItem>
                        <FormLabel>Photos</FormLabel>
                        <FormControl>
                           <Input
                              {...fieldProps}
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(event) =>
                                 onChange(Array.from(event.target.files ?? []))
                              }
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               {watchPhotos && watchPhotos?.length > 0 && (
                  <div className="mb-2 mt-4">
                     <Label>Uploaded Photos</Label>
                  </div>
               )}
               <div className="grid grid-cols-3 justify-evenly justify-items-center gap-2 lg:grid-cols-2">
                  {watchPhotos?.map((photo, key) => (
                     <div className="relative h-32 w-32" key={key}>
                        <Image
                           src={URL.createObjectURL(photo)}
                           alt={`Preview ${key + 1}`}
                           fill
                           className="rounded-md object-cover"
                        />
                     </div>
                  ))}
               </div>
            </div>
            <Button
               type="submit"
               className="block w-full lg:hidden"
               disabled={loading}
            >
               {buttonContent}
            </Button>
         </form>
      </Form>
   );
};

export default CreateForm;
