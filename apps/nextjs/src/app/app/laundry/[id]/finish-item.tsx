"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/client";

import { Button } from "@laundrey/ui/button";
import { Spinner } from "@laundrey/ui/icons";

const FinishItem: React.FC<{ id: string; returned: Date | null }> = ({
   id,
   returned,
}) => {
   const [loading, setLoading] = useState(false);
   const router = useRouter();

   return (
      <Button
         className="flex w-full items-center justify-center gap-2 text-center"
         onClick={async () => {
            if (!confirm("Are you sure you want to do this?")) return;
            setLoading(true);
            try {
               await api.laundry.finishItem.mutate({ id });
               // GET STRANGE UNAUTHORIZED ERROR
               // await revalidateTRPC("laundry", "get");
               router.refresh();
               setLoading(false);
            } catch (error) {
               setLoading(false);
            }
         }}
         disabled={loading || returned !== null}
      >
         {loading && <Spinner className="animate-spin" />}
         {loading ? "Finishing" : "Finish"}
      </Button>
   );
};

export default FinishItem;
