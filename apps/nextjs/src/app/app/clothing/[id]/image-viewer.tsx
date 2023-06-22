"use image";

import Image from "next/image";

import { shimmer } from "@laundrey/ui";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@laundrey/ui/dialog";

const ImageViewer: React.FC<{ photo: string; index: number }> = ({
   photo,
   index,
}) => {
   return (
      <div className="w-[100%] md:flex-shrink-0">
         <Dialog>
            <DialogTrigger asChild>
               <Image
                  src={photo}
                  placeholder="blur"
                  blurDataURL={shimmer(500, 500)}
                  alt={`Photo #${index + 1}`}
                  width={500}
                  height={300}
                  className="h-64 object-cover"
               />
            </DialogTrigger>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle className="mb-2">Photo #{index + 1}</DialogTitle>
                  <Image
                     src={photo}
                     placeholder="blur"
                     blurDataURL={shimmer(500, 500)}
                     alt={`Photo #${index + 1}`}
                     width={500}
                     height={500}
                     className="h-96 object-cover"
                  />
               </DialogHeader>
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default ImageViewer;
