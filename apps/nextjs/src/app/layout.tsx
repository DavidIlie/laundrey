import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@laundrey/ui/toaster";

import "~/styles/style.css";

import { cn } from "@laundrey/ui";

import ThemeHotkey from "~/components/theme-hotkey";
import { ThemeProvider } from "~/components/theme-provider";

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

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en" suppressHydrationWarning className="bg-background">
         <body
            className={cn(
               "min-h-screen font-sans antialiased",
               fontSans.variable,
            )}
         >
            <ThemeProvider attribute="class">
               <ThemeHotkey />
               {children}
               <Toaster />
            </ThemeProvider>
         </body>
      </html>
   );
}
