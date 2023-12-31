import { api } from "~/trpc/server-invoker";

import {
   Table,
   TableBody,
   TableHead,
   TableHeader,
   TableRow,
} from "@laundrey/ui/table";

import AddNew from "./category/add-new";
import Row from "./category/row";

const CategoriesModule = async () => {
   const categories = await api.categories.all.query();

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
               {categories.map((category) => (
                  <Row category={category} key={category.id} />
               ))}
            </TableBody>
         </Table>
      </>
   );
};

export default CategoriesModule;
