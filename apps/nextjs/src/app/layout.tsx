import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { Toaster } from "@laundrey/ui/toaster";

import "~/styles/style.css";

import { getServerSessionUser } from "@laundrey/api";
import type { User } from "@laundrey/api/client";
import { cn } from "@laundrey/ui";

import ThemeHotkey from "~/components/theme-hotkey";
import { ThemeProvider } from "~/components/theme-provider";
import { UserProvider } from "~/components/user-provider";

export const metadata: Metadata = {
   title: {
      default: "Laundrey",
      template: "%s | Laundrey",
   },
};

const fontSans = Inter({
   subsets: ["latin"],
   variable: "--font-sans",
});

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const cookieStore = cookies();
   const auth = cookieStore.get("access");
   let session: User = null;
   if (auth) session = await getServerSessionUser(auth.value);
   return (
      <html lang="en" className="bg-background">
         <body
            className={cn(
               "min-h-screen font-sans antialiased",
               fontSans.variable,
            )}
         >
            <UserProvider user={session}>
               <ThemeProvider attribute="class">
                  <ThemeHotkey />
                  {children}
                  <Toaster />
               </ThemeProvider>
            </UserProvider>
         </body>
      </html>
   );
}
