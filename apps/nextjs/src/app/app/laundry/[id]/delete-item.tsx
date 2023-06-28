"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/client";
import { revalidateTRPC } from "~/lib/revalidateTRPC";

import { Button } from "@laundrey/ui/button";
import { Spinner } from "@laundrey/ui/icons";

const DeleteItem: React.FC<{ id: string }> = ({ id }) => {
   const [loading, setLoading] = useState(false);
   const router = useRouter();

   return (
      <Button
         variant="destructive"
         onClick={async () => {
            if (!confirm("Are you sure you want to do this?")) return;
            setLoading(true);
            try {
               const res = await api.laundry.removeItem.mutate({ id });

               if (res) {
                  await revalidateTRPC("laundry", "all");
                  return router.push("/app/laundry");
               }

               // GET STRANGE UNAUTHORIZED ERROR
               // await revalidateTRPC("laundry", "get");
               router.refresh();
               setLoading(false);
            } catch (error) {
               setLoading(false);
            }
         }}
         className="flex w-full items-center justify-center gap-2 text-center"
         disabled={loading}
      >
         {loading && <Spinner className="animate-spin" />}
         {loading ? "Deleting" : "Delete"}
      </Button>
   );
};

export default DeleteItem;
