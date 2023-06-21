import React from "react";

const AppLayout: React.FC<{
   title: string;
   description?: string;
   children: React.ReactNode;
}> = ({ title, description, children }) => {
   return (
      <>
         <h1 className="text-2xl font-semibold">{title}</h1>
         {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
               {description}
            </p>
         )}
         <div className="mb-2" />
         {children}
      </>
   );
};

export default AppLayout;
