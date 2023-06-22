import { TRPCError } from "@trpc/server";
import { PostPolicyResult } from "minio";
import { v4 } from "uuid";

import {
   clothingValidator,
   findByIdValidator,
   serverPhotoValidator,
} from "../../validators";
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
         include: { categories: true, brand: true },
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
               brandId: input.brand,
               quantity: input.quantity,
               categories: {
                  connect: foundCategories,
               },
               photos: photoKeys?.map(
                  (s) =>
                     `${env.MINIO_PROTOCOL}://${env.MINIO_URL}/${env.MINIO_BUCKET}/${s}`,
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
   get: protectedProcedure
      .input(findByIdValidator)
      .query(async ({ ctx, input }) => {
         return await ctx.prisma.clothing.findFirst({
            where: { id: input.id, userId: ctx.session.id },
            include: {
               categories: true,
               brand: true,
            },
         });
      }),
   delete: protectedProcedure
      .input(findByIdValidator)
      .mutation(async ({ ctx, input }) => {
         const clothing = await ctx.prisma.clothing.findFirst({
            where: { id: input.id, userId: ctx.session.id },
         });

         if (!clothing)
            throw new TRPCError({
               message: "You do not have this clothing!",
               code: "BAD_REQUEST",
            });

         await ctx.prisma.clothing.delete({
            where: { id: clothing.id },
         });

         if (clothing.photos.length !== 0) {
            const photoKeys = clothing.photos.map(
               (photo) =>
                  photo.split(
                     `${env.MINIO_PROTOCOL}://${env.MINIO_URL}/${env.MINIO_BUCKET}/`,
                  )[1]!,
            );
            await minio.removeObjects(env.MINIO_BUCKET, photoKeys);
         }

         return true;
      }),
});
