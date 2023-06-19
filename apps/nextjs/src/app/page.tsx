import { api } from "~/trpc/server";

const Page = async () => {
   const data = await api.hello.hello.query();
   return <h1>{data}</h1>;
};

export default Page;
