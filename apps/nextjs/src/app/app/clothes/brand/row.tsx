"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TRPCError } from "@trpc/server";
import { formatDistance } from "date-fns";

import { api } from "~/trpc/client";

import type { RouterOutputs } from "@laundrey/api";
import { TableCell, TableRow } from "@laundrey/ui/table";
import { useToast } from "@laundrey/ui/use-toast";

import Sheet from "./sheet";

const Row: React.FC<{ brand: RouterOutputs["brands"]["all"][0] }> = ({
   brand,
}) => {
   const [loading, setLoading] = useState(false);
   const { toast } = useToast();
   const router = useRouter();

   return (
      <TableRow>
         <TableCell className="font-medium">{brand.name}</TableCell>
         <TableCell className="max-w-[15rem] truncate lg:max-w-[25rem]">
            {brand.description || "No description..."}
         </TableCell>
         <TableCell>{brand._count.clothes}</TableCell>
         <TableCell className="hidden text-right lg:block">
            {formatDistance(brand.created, new Date(), {
               addSuffix: true,
            })}
         </TableCell>
         <TableCell className="text-right">
            <div className="flex items-center gap-2">
               <Sheet initial={brand}>
                  <p className="cursor-pointer duration-150 hover:text-blue-500">
                     Edit
                  </p>
               </Sheet>
               <button
                  className="flex items-center gap-4 duration-150 hover:text-red-500"
                  onClick={async () => {
                     if (confirm("Are you sure you want to do this?")) {
                        try {
                           setLoading(true);
                           await api.brands.delete.mutate({ id: brand.id });
                           setLoading(false);
                           router.refresh();
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
                     }
                  }}
                  disabled={loading}
               >
                  {loading ? "Deleting" : "Delete"}
               </button>
            </div>
         </TableCell>
      </TableRow>
   );
};

export default Row;
