"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TRPCError } from "@trpc/server";

import { api } from "~/trpc/client";

import { Button } from "@laundrey/ui/button";
import { Spinner } from "@laundrey/ui/icons";
import { useToast } from "@laundrey/ui/use-toast";

const DeleteButton: React.FC<{ id: string }> = ({ id }) => {
   const [loading, setLoading] = useState(false);
   const { toast } = useToast();
   const router = useRouter();

   return (
      <Button
         variant="destructive"
         onClick={async () => {
            if (confirm("Are you sure you want to do this?")) {
               setLoading(true);
               try {
                  await api.clothes.delete.mutate({ id });
                  setLoading(false);
                  router.push("/app/clothes");
                  toast({
                     title: "Clothing",
                     description: "Deleted successfully!",
                  });
               } catch (error) {
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
      >
         {loading && <Spinner className="animate-spin" />}
         {loading ? "Deleting" : "Delete"}
      </Button>
   );
};

export default DeleteButton;
