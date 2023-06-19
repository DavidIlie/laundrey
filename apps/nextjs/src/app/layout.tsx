import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@laundrey/ui/toaster";

import "~/styles/style.css";

export const metadata: Metadata = {
   title: {
      default: "Laundrey",
      template: "%s | Laundrey",
   },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en">
         <body
            className={`flex min-h-screen flex-col bg-gray-800 text-white ${inter.className}`}
         >
            {children}
            <Toaster />
         </body>
      </html>
   );
}
