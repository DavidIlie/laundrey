import React from "react";

import { cn } from "@laundrey/ui";

const AppLayout: React.FC<{
   title: string;
   description?: string;
   children: React.ReactNode;
   className?: string;
}> = ({ title, description, children, className }) => {
   return (
      <div className="px-1 sm:px-0">
         <h1 className="text-2xl font-semibold">{title}</h1>
         {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
               {description}
            </p>
         )}
         <div className={cn("mt-2", className)}>{children}</div>
      </div>
   );
};

export default AppLayout;
