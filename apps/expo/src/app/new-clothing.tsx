/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Controller } from "react-hook-form";

import { api } from "~/lib/api";

import { useZodForm } from "@laundrey/api/form";
import {
   clientPhotoValidator,
   clothingValidator,
} from "@laundrey/api/validators";

import Button from "~/components/Button";
import { FormItem, FormMessage } from "~/components/form";
import Input from "~/components/Input";
import Label from "~/components/Label";
import { LoadingOverlayElement } from "~/components/LoadingOverlay";

const joinedValidator = clothingValidator.and(clientPhotoValidator);

const Page = () => {
   const [openBrands, setOpenBrands] = useState(false);
   const [openCategories, setOpenCategories] = useState(false);

   const categoriesR = api.categories.all.useQuery();
   const brandsR = api.brands.all.useQuery();
   const createMutation = api.clothes.create.useMutation();

   const isLoading = !brandsR.data || !categoriesR.data;

   const form = useZodForm({
      schema: joinedValidator,
      defaultValues: {
         quantity: 1,
      },
   });

   if (isLoading) return <LoadingOverlayElement />;

   const categories = categoriesR.data.map((cat) => ({
      label: cat.name,
      value: cat.id,
   }));

   const brands = brandsR.data.map((cat) => ({
      label: cat.name,
      value: cat.id,
   }));

   return (
      <View className="px-3 py-2">
         <Text className="mb-4 text-xl font-semibold">New Clothing</Text>
         <Controller
            control={form.control}
            name="name"
            render={({ field }) => (
               <FormItem>
                  <Label>Name</Label>
                  <Input {...field} autoCapitalize="none" />
                  <FormMessage error={form.formState.errors.name} />
               </FormItem>
            )}
         />
         <View className="my-2" />
         <Controller
            control={form.control}
            name="brand"
            render={({ field }) => (
               <>
                  <Label>Brand</Label>
                  <View className="my-1" />
                  <DropDownPicker
                     open={openBrands}
                     value={field.value}
                     items={brands}
                     setOpen={setOpenBrands}
                     setValue={(v: any) => field.onChange(v())}
                     style={{
                        borderColor: "#e5e7eb",
                     }}
                     dropDownContainerStyle={{
                        borderColor: "#e5e7eb",
                     }}
                     listMode="SCROLLVIEW"
                     placeholder="Select a brand"
                     maxHeight={150}
                  />
                  <View className="my-1" />
                  <FormMessage error={form.formState.errors.brand} />
               </>
            )}
         />
         <View className="my-2" />
         <Controller
            control={form.control}
            name="category"
            render={({ field }) => (
               <>
                  <Label>Category</Label>
                  <View className="my-1" />
                  <DropDownPicker
                     open={openCategories}
                     listMode="SCROLLVIEW"
                     maxHeight={150}
                     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                     //@ts-ignore
                     value={field.value}
                     items={categories}
                     setOpen={setOpenCategories}
                     setValue={(v: any) => field.onChange(v())}
                     zIndex={2000}
                     zIndexInverse={1000}
                     mode="BADGE"
                     showBadgeDot={false}
                     style={{
                        borderColor: "#e5e7eb",
                     }}
                     dropDownContainerStyle={{
                        borderColor: "#e5e7eb",
                     }}
                     placeholder="Select a category"
                  />
                  <View className="my-1" />
                  <FormMessage error={form.formState.errors.brand} />
               </>
            )}
         />
         <View className="my-2" />
         <Controller
            control={form.control}
            name="quantity"
            render={({ field }) => (
               <FormItem>
                  <Label>Quantity</Label>
                  <Input
                     {...field}
                     autoCapitalize="none"
                     inputMode="numeric"
                     value={field.value.toString()}
                  />
                  <FormMessage error={form.formState.errors.quantity} />
               </FormItem>
            )}
         />
         <View className="my-2" />

         <Button
            onPress={form.handleSubmit(async (values) => {
               console.log(values);
            })}
         >
            <Text>Create</Text>
         </Button>
      </View>
   );
};

export default Page;
