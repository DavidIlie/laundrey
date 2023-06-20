"use client";

import { useSession } from "~/lib/user-provider";

const TestClient = () => {
   const session = useSession();

   console.log(session);

   return <h1>hi, {session.user?.name}</h1>;
};

export default TestClient;
