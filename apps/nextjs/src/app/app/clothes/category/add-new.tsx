"use client";

import { Button } from "@laundrey/ui/button";

import Sheet from "./sheet";

const AddNew: React.FC = () => {
   return (
      <Sheet>
         <Button className="mb-3">Add new</Button>
      </Sheet>
   );
};

export default AddNew;
