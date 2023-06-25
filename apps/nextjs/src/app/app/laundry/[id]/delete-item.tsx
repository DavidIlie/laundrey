"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/client";

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
               console.log("hey");
               await api.laundry.removeItem.mutate({ id });
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
