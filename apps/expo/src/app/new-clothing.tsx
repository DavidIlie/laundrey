/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Controller } from "react-hook-form";

import { api } from "~/lib/api";

import { useZodForm } from "@laundrey/api/form";
import { appPhotoValidator, clothingValidator } from "@laundrey/api/validators";

import Button from "~/components/Button";
import { FormItem, FormMessage } from "~/components/form";
import Input from "~/components/Input";
import Label from "~/components/Label";
import { LoadingOverlayElement } from "~/components/LoadingOverlay";

const joinedValidator = clothingValidator.and(appPhotoValidator);

const Page = () => {
   const [openBrands, setOpenBrands] = useState(false);
   const [openCategories, setOpenCategories] = useState(false);
   const { showActionSheetWithOptions } = useActionSheet();

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
      <ScrollView className="px-3 py-2">
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
                     setValue={(v: any) => {
                        if (field.value) {
                           field.onChange([...field.value, v()]);
                        } else {
                           field.onChange([v()]);
                        }
                     }}
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
         <Controller
            control={form.control}
            name="photos"
            render={({ field }) => (
               <FormItem>
                  <Button
                     className="w-[40%]"
                     onPress={async () => {
                        const permission =
                           await ImagePicker.requestCameraPermissionsAsync();

                        const options = permission.granted
                           ? ["Camera", "Photos", "Cancel"]
                           : ["Photos", "Cancel"];

                        const handleImage = (
                           images: ImagePicker.ImagePickerResult,
                        ) => {
                           const image = images.assets![0]!;

                           const fileName = image.uri.substring(
                              image.uri.lastIndexOf("/") + 1,
                              image.uri.length,
                           );

                           const object = { fileName, uri: image.uri };

                           if (field.value) {
                              field.onChange([...field.value, object]);
                           } else {
                              field.onChange([object]);
                           }
                        };

                        showActionSheetWithOptions(
                           { options, cancelButtonIndex: options.length },
                           async (selectedIndex) => {
                              if (permission.granted) {
                                 switch (selectedIndex) {
                                    case 0:
                                       handleImage(
                                          await ImagePicker.launchCameraAsync({
                                             allowsEditing: true,
                                             aspect: [4, 3],
                                          }),
                                       );
                                       break;
                                    case 1:
                                       handleImage(
                                          await ImagePicker.launchImageLibraryAsync(
                                             {
                                                allowsEditing: true,
                                                aspect: [4, 3],
                                             },
                                          ),
                                       );
                                       break;
                                    case 2:
                                       break;
                                 }
                              } else {
                                 switch (selectedIndex) {
                                    case 0:
                                       handleImage(
                                          await ImagePicker.launchImageLibraryAsync(
                                             {
                                                allowsEditing: true,
                                                aspect: [4, 3],
                                             },
                                          ),
                                       );
                                       break;
                                    case 1:
                                       break;
                                 }
                              }
                           },
                        );
                     }}
                  >
                     <Text>Add Photos</Text>
                  </Button>
                  <View className="mt-2">
                     <View className="flex flex-row gap-2">
                        {field.value?.map((photo, i) => (
                           <Image
                              key={i}
                              source={{
                                 uri: photo.uri,
                              }}
                              style={{
                                 width: 100,
                                 height: 100,
                              }}
                           />
                        ))}
                     </View>
                  </View>
               </FormItem>
            )}
         />

         <View className="my-2" />
         <Button
            onPress={form.handleSubmit(async (values) => {
               const mutation = await createMutation.mutateAsync({
                  name: values.name,
                  brand: values.brand,
                  category: values.category,
                  quantity: values.quantity,
                  photos: values.photos?.map((s) => s.fileName),
               });

               if (Array.isArray(mutation)) {
                  await Promise.all(
                     mutation.map(async (s) => {
                        const file = values.photos!.filter(
                           (b) => b.fileName === s.fileName,
                        )[0]!;

                        console.log("UPLOAD SUCCESSFUL", file.fileName);
                     }),
                  );
               }
            })}
         >
            <Text>Create</Text>
         </Button>
      </ScrollView>
   );
};

export default Page;
