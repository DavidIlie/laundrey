"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

import { signOut, useSession } from "~/lib/user-provider";

import { getInitials } from "@laundrey/api/client";
import { cn } from "@laundrey/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@laundrey/ui/avatar";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@laundrey/ui/dropdown-menu";
import type { Icon } from "@laundrey/ui/icons";
import { Dashboard, Settings, Shirt, ShoppingBag } from "@laundrey/ui/icons";
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTrigger,
} from "@laundrey/ui/sheet";

const Navigation: React.FC = () => {
   const session = useSession();

   const { resolvedTheme, setTheme } = useTheme();

   return (
      <aside className="relative flex h-[20%] items-center justify-between p-5 lg:block lg:min-h-screen lg:w-[25%]">
         <AppLogo className="hidden lg:block" />
         <NavigationPages className="hidden lg:block" />
         <Sheet>
            <SheetTrigger asChild>
               <Settings className="lg:hidden" />
            </SheetTrigger>
            <SheetContent position="left" size="full">
               <AppLogo />
               <SheetHeader>
                  <NavigationPages />
               </SheetHeader>
            </SheetContent>
         </Sheet>
         <div className="z-20 flex duration-150 cursor-pointer lg:absolute lg:bottom-0 lg:left-0 lg:w-full lg:items-center lg:space-x-4 lg:p-4 lg:hover:bg-gray-50 lg:dark:hover:bg-container/90">
            <DropdownMenu>
               <DropdownMenuTrigger className="items-center w-full gap-2 lg:flex">
                  <Avatar>
                     <AvatarImage src={session.user?.image as string} />
                     <AvatarFallback>
                        {getInitials(session.user?.name)}
                     </AvatarFallback>
                  </Avatar>
                  <h1 className="hidden lg:block">{session.user?.name}</h1>
               </DropdownMenuTrigger>
               <DropdownMenuContent className="w-60">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                     <Link href="/app/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                     Log Out
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Misc</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                     <a
                        href="https://github.com/davidilie/laundrey/issues"
                        target="_blank"
                        rel="noreferrer"
                     >
                        Report a bug
                     </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     onClick={() =>
                        setTheme(resolvedTheme === "dark" ? "light" : "dark")
                     }
                  >
                     {resolvedTheme === "dark" ? "Light" : "Dark"} Mode
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </aside>
   );
};

const AppLogo: React.FC<{ className?: string }> = ({ className }) => {
   return (
      <Link
         href="/app"
         className={cn(
            "text-2xl font-bold text-blue-500 dark:text-blue-400",
            className,
         )}
      >
         Laund<span className="text-red-500 dark:text-red-400">rey</span>
      </Link>
   );
};

const NavigationPages: React.FC<{ className?: string }> = ({ className }) => {
   return (
      <div className={cn("-ml-1 mt-8 space-y-2", className)}>
         <NavigationElement icon={Dashboard} title="Dashboard" href="/" />
         <NavigationElement
            icon={ShoppingBag}
            title="Laundry"
            href="/laundry"
         />
         <NavigationElement icon={Shirt} title="Clothes" href="/clothes" />
      </div>
   );
};

const NavigationElement: React.FC<{
   icon: Icon;
   title: string;
   href: string;
}> = ({ title, href, ...rest }) => {
   const pathname = usePathname();
   return (
      <Link
         href={`/app${href}`}
         className={cn(
            "flex items-center gap-3 rounded-lg px-2 py-3 duration-150",
            pathname === `/app${href === "/" && ""}`
               ? "pointer-events-none bg-gray-100 dark:bg-container/80"
               : "hover:bg-gray-100 dark:hover:bg-container/90",
         )}
      >
         <rest.icon />
         <h1 className="font-medium">{title}</h1>
      </Link>
   );
};

export default Navigation;
