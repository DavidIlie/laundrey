import { api } from "~/trpc/server";

import {
   Table,
   TableBody,
   TableHead,
   TableHeader,
   TableRow,
} from "@laundrey/ui/table";

import AddNew from "./brand/add-new";
import Row from "./brand/row";

const BrandsModule = async () => {
   const brands = await api.brands.all.query();

   return (
      <>
         <AddNew />
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead className="w-[150px]">Name</TableHead>
                  <TableHead className="w-[200px]">Description</TableHead>
                  <TableHead className="w-[200px]"># of Clothes</TableHead>
                  <TableHead className="hidden text-right lg:table-cell">
                     Added
                  </TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {brands.map((brand) => (
                  <Row brand={brand} key={brand.id} />
               ))}
            </TableBody>
         </Table>
      </>
   );
};

export default BrandsModule;
