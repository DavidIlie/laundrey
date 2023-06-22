import type { Metadata } from "next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@laundrey/ui/tabs";

import AppLayout from "~/app/layout/app-layout";
import BrandsModule from "./module-brands";
import CategoriesModule from "./module-categories";
import ClothesModule from "./module-clothes";

export const metadata: Metadata = {
   title: "Clothes",
};

const Page = () => {
   return (
      <AppLayout
         title="Clothing"
         description="Manage all your items of clothing."
      >
         <Tabs defaultValue="clothes">
            <TabsList className="w-full">
               <TabsTrigger value="clothes" className="w-1/3">
                  Clothes
               </TabsTrigger>
               <TabsTrigger value="brands" className="w-1/3">
                  Brands
               </TabsTrigger>
               <TabsTrigger value="categories" className="w-1/3">
                  Categories
               </TabsTrigger>
            </TabsList>
            <TabsContent value="clothes">
               <ClothesModule />
            </TabsContent>
            <TabsContent value="brands">
               <BrandsModule />
            </TabsContent>
            <TabsContent value="categories">
               <CategoriesModule />
            </TabsContent>
         </Tabs>
      </AppLayout>
   );
};

export default Page;
