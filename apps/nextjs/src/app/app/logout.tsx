"use client";

import { signOut } from "~/lib/user-provider";

const Logout = () => {
   return (
      <span onClick={() => signOut()} className="cursor-pointer">
         Log Out
      </span>
   );
};

export default Logout;
