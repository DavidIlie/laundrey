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
import { Dashboard, Shirt } from "@laundrey/ui/icons";

const Navigation: React.FC<{ className: string }> = ({ className }) => {
   const session = useSession();

   const { resolvedTheme, setTheme } = useTheme();

   return (
      <aside className={className}>
         <Link
            href="/app"
            className="text-2xl font-bold text-blue-500 dark:text-blue-400"
         >
            Laund<span className="text-red-500 dark:text-red-400">rey</span>
         </Link>
         <div className="my-8 space-y-2">
            <NavigationElement icon={Dashboard} title="Dashboard" href="/" />
            <NavigationElement icon={Shirt} title="Clothes" href="/clothes" />
         </div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <div className="absolute bottom-0 left-0 z-20 items-center justify-center hidden w-full p-4 space-x-4 duration-150 cursor-pointer hover:bg-gray-50 dark:hover:bg-container/90 lg:flex">
                  <Avatar>
                     <AvatarImage src={session.user?.image as string} />
                     <AvatarFallback>
                        {getInitials(session.user?.name)}
                     </AvatarFallback>
                  </Avatar>
                  <h1>{session.user?.name}</h1>
               </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
               <DropdownMenuLabel>My Account</DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuItem>Profile</DropdownMenuItem>
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
      </aside>
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
            "flex items-center gap-3 rounded-md px-2 py-3 duration-150",
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
