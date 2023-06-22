import { TRPCError } from "@trpc/server";
import { PostPolicyResult } from "minio";
import { v4 } from "uuid";

import { clothingValidator, serverPhotoValidator } from "../../validators";
import { env } from "../env.mjs";
import { minio } from "../lib/minio";
import { createTRPCRouter, protectedProcedure } from "../trpc";

type PresignedURL = PostPolicyResult & {
   fileName: string;
};

export const clothesRouter = createTRPCRouter({
   all: protectedProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.clothing.findMany({
         where: { userId: ctx.session.id },
         include: { categories: true },
      });
   }),
   create: protectedProcedure
      .input(clothingValidator.and(serverPhotoValidator))
      .mutation(async ({ ctx, input }) => {
         let foundCategories: { id: string }[] = [];

         if (input.category)
            await Promise.all(
               input.category?.map(async (category) => {
                  const found = await ctx.prisma.category.findFirst({
                     where: { userId: ctx.session.id, id: category },
                  });
                  if (found) return foundCategories.push({ id: found.id });
                  throw new TRPCError({
                     message: "You do not have this category!",
                     code: "BAD_REQUEST",
                  });
               }),
            );

         const id = v4();

         const photoKeys = input.photos?.map(
            (file) => `${ctx.session.id}/${id}_${file}`,
         );

         await ctx.prisma.clothing.create({
            data: {
               id,
               userId: ctx.session.id,
               name: input.name,
               brand: input.brand,
               quantity: input.quantity,
               categories: {
                  connect: foundCategories,
               },
               photos: photoKeys?.map(
                  (s) => `https://${env.MINIO_URL}/${env.MINIO_BUCKET}/${s}`,
               ),
            },
         });

         let presignedUrls: PresignedURL[] = [];

         if (input.photos)
            await Promise.all(
               input.photos?.map(async (_photo, index) => {
                  const policy = minio.newPostPolicy();
                  policy.setKey(photoKeys![index]!);
                  policy.setBucket(env.MINIO_BUCKET);

                  const presignedUrl = await minio.presignedPostPolicy(policy);
                  presignedUrls.push({
                     ...presignedUrl,
                     fileName: input.photos![index]!,
                  });
               }),
            );

         if (presignedUrls.length !== 0) return presignedUrls;

         return true;
      }),
});
