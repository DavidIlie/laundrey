import { prisma } from "@laundrey/db";

export const createUsername = async (fullName: string): Promise<string> => {
   const names = fullName.toLowerCase().split(" ");

   let username = names[0];

   const firstCheck = await prisma.user.findFirst({ where: { username } });

   if (firstCheck) {
      if (names.length > 1) {
         username = `${names[0]}-${names[1]}`;
         const secondCheck = await prisma.user.findFirst({
            where: { username },
         });
         if (secondCheck) {
            username = `${username}-${Math.floor(1000 + Math.random() * 9000)}`;
         }
      } else {
         username = `${names[0]}-${names[1]}`;
      }
   }

   if (!username) throw new Error("impossible");

   return username;
};
