/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TRPCError } from "@trpc/server";
import { format } from "date-fns";

import { api } from "~/trpc/client";
import type { RouterOutputs } from "~/trpc/shared";

import { useZodForm } from "@laundrey/api/form";
import { laundryEventValidator } from "@laundrey/api/validators";
import { cn } from "@laundrey/ui";
import { Button } from "@laundrey/ui/button";
import { Calendar } from "@laundrey/ui/calendar";
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
import { CalendarIcon, Check, Spinner } from "@laundrey/ui/icons";
import { Input } from "@laundrey/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@laundrey/ui/popover";
import { useToast } from "@laundrey/ui/use-toast";

// @TODO: Fix bug with the ordering of the arrays when you pick first another one before an empty

const CreateForm: React.FC<{
   clothes: RouterOutputs["clothes"]["allForLaundry"];
}> = ({ clothes: serverFedClothes }) => {
   const { toast } = useToast();
   const router = useRouter();

   const form = useZodForm({
      schema: laundryEventValidator,
      defaultValues: {
         created: new Date(),
         items: [{ quantity: 1, clothingId: "" }],
      },
   });

   const [loading, setLoading] = useState(false);
   const [clothingPickers, setClothingPickers] = useState(1);

   const clothes = serverFedClothes.map((cat) => ({
      label: cat.name,
      value: cat.id,
   }));

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(async (values) => {
               setLoading(true);
               try {
                  await api.laundry.create.mutate(values);
                  router.push("/app/laundry");
                  setLoading(false);
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
            })}
         >
            <div className="space-y-3">
               <FormField
                  control={form.control}
                  name="created"
                  render={({ field }) => (
                     <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                           <PopoverTrigger asChild>
                              <FormControl>
                                 <Button
                                    variant="outline"
                                    className={cn(
                                       "pl-3 text-left font-normal dark:bg-gray-800",
                                       !field.value && "text-muted-foreground",
                                    )}
                                 >
                                    {field.value ? (
                                       format(field.value, "PPP")
                                    ) : (
                                       <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                 </Button>
                              </FormControl>
                           </PopoverTrigger>
                           <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                 mode="single"
                                 selected={field.value}
                                 onSelect={field.onChange}
                                 disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                 }
                                 initialFocus
                              />
                           </PopoverContent>
                        </Popover>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="items"
                  render={({ field }) => (
                     <div className="space-y-3">
                        <Button
                           onClick={() => {
                              setClothingPickers(clothingPickers + 1);
                              field.onChange([
                                 ...field.value,
                                 { quantity: 1, clothingId: "" },
                              ]);
                           }}
                           type="button"
                        >
                           Add More
                        </Button>
                        {[...Array(clothingPickers)].map((_value, index) => (
                           <FormItem key={index} className="flex flex-col">
                              <FormLabel>Clothing #{index + 1}</FormLabel>
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <FormControl>
                                       <Button
                                          variant="outline"
                                          role="combobox"
                                          className={cn(
                                             "justify-between bg-white dark:bg-gray-800",
                                             !field.value &&
                                                "text-muted-foreground",
                                          )}
                                       >
                                          {field.value[index]!.clothingId !==
                                             "" &&
                                             clothes.filter(
                                                (s) =>
                                                   s.value ==
                                                   field.value[index]!
                                                      .clothingId,
                                             )[0]!.label}
                                       </Button>
                                    </FormControl>
                                 </PopoverTrigger>
                                 <PopoverContent className="w-[300px] p-0">
                                    <Command>
                                       <CommandInput placeholder="Search clothing..." />
                                       <CommandEmpty>
                                          No clothing found.
                                       </CommandEmpty>
                                       <CommandGroup>
                                          {clothes
                                             .filter(
                                                (s) =>
                                                   !field.value
                                                      .map((b) => b.clothingId)
                                                      .includes(s.value),
                                             )
                                             .map((clothing) => (
                                                <CommandItem
                                                   value={clothing.value}
                                                   key={clothing.value}
                                                   onSelect={(value) => {
                                                      form.setValue("items", [
                                                         ...field.value.filter(
                                                            (_s, Sindex) =>
                                                               Sindex !== index,
                                                         ),
                                                         {
                                                            quantity:
                                                               field.value[
                                                                  index
                                                               ]!.quantity,
                                                            clothingId: value,
                                                         },
                                                      ]);
                                                   }}
                                                >
                                                   <Check
                                                      className={cn(
                                                         "mr-2 h-4 w-4",
                                                         field.value
                                                            .map(
                                                               (s) =>
                                                                  s.clothingId,
                                                            )
                                                            .includes(
                                                               clothing.value,
                                                            )
                                                            ? "opacity-100"
                                                            : "opacity-0",
                                                      )}
                                                   />
                                                   {clothing.label}
                                                </CommandItem>
                                             ))}
                                       </CommandGroup>
                                    </Command>
                                 </PopoverContent>
                              </Popover>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    value={field.value[index]!.quantity}
                                    onChange={(e) => {
                                       if (parseInt(e.target.value) < 1) return;
                                       form.setValue("items", [
                                          ...field.value.filter(
                                             (_s, Sindex) => Sindex !== index,
                                          ),
                                          {
                                             quantity: parseInt(e.target.value),
                                             clothingId:
                                                field.value[index]!.clothingId,
                                          },
                                       ]);
                                    }}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        ))}
                     </div>
                  )}
               />
               <Button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 text-center"
                  disabled={loading}
               >
                  {loading && <Spinner className="animate-spin" />}
                  {loading ? "Creating" : "Create"}
               </Button>
            </div>
         </form>
      </Form>
   );
};

export default CreateForm;
