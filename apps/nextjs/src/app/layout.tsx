import { Inter } from "next/font/google";

import "~/styles/style.css";

export const metadata = {
   title: "Laundrey",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en">
         <body className={inter.className}>{children}</body>
      </html>
   );
}
