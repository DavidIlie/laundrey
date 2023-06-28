import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";

import { api } from "~/lib/api";

import Button from "~/components/Button";
import Clothing from "~/components/Clothing";

const BrandsModule: React.FC = () => {
   const { isLoading, data } = api.clothes.all.useQuery();
   const router = useRouter();

   if (isLoading || !data)
      return (
         <View className="mt-4">
            <ActivityIndicator size="large" color="#000000" />
         </View>
      );

   return (
      <ScrollView className="h-full">
         <Button
            className="w-1/4"
            onPress={() => router.push("/app/new-clothing")}
         >
            <Text>Add New</Text>
         </Button>
         <View className="h-3" />
         <FlashList
            data={data}
            estimatedItemSize={20}
            ItemSeparatorComponent={() => <View className="h-4" />}
            renderItem={(clothing) => <Clothing clothing={clothing.item} />}
         />
         {data.length === 0 && <Text>No clothes...</Text>}
         <View className="h-28" />
      </ScrollView>
   );
};

export default BrandsModule;
