import { Text } from "react-native";

import { api } from "~/lib/api";

import { useZodForm } from "@laundrey/api/form";
import {
   clientPhotoValidator,
   clothingValidator,
} from "@laundrey/api/validators";

import { LoadingOverlayElement } from "~/components/LoadingOverlay";

const joinedValidator = clothingValidator.and(clientPhotoValidator);

const Page = () => {
   const categoriesR = api.categories.all.useQuery();
   const brandsR = api.brands.all.useQuery();

   const isLoading = categoriesR.isLoading || brandsR.isLoading;

   const form = useZodForm({
      schema: joinedValidator,
      defaultValues: {
         quantity: 1,
      },
   });

   const categories = categoriesR.data?.map((cat) => ({
      label: cat.name,
      value: cat.id,
   }));

   const brands = brandsR.data?.map((cat) => ({
      label: cat.name,
      value: cat.id,
   }));

   if (isLoading) return <LoadingOverlayElement />;

   return (
      <>
         <Text>Create a new clothing</Text>
      </>
   );
};

export default Page;
