import { Redirect } from "expo-router";

import { useSession } from "~/lib/auth";

import { LoadingOverlayElement } from "~/components/LoadingOverlay";

const Page = () => {
   const { status } = useSession();
   if (status === "loading") return <LoadingOverlayElement />;
   if (status === "unauthenticated") return <Redirect href="/signin" />;
   if (status === "authenticated") return <Redirect href="/app" />;
};

export default Page;
