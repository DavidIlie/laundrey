import { z } from "zod";

const passwordDefault = z.string().min(6);

export const newAdminUserValidator = z.object({
   email: z.string().email(),
   name: z.string(),
   password: passwordDefault,
});

export const loginValidator = z.object({
   email: z.string().email(),
   password: passwordDefault,
   remember: z.boolean(),
});

export const brandAndCategoryValidator = z.object({
   name: z.string(),
   description: z.string().optional(),
});

export const findByIdValidator = z.object({ id: z.string().uuid() });

export const clothingValidator = z.object({
   name: z.string(),
   brand: z.string().uuid(),
   category: z.array(z.string().uuid()).optional(),
   quantity: z.number(),
});

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
   "image/jpeg",
   "image/jpg",
   "image/png",
   "image/webp",
   "image/heif",
];

export const appPhotoValidator = z.object({
   photos: z
      .array(
         z.object({
            fileName: z.string(),
            uri: z.string(),
         }),
      )
      .optional(),
});

export const clientPhotoValidator = z.object({
   photos: z
      .array(z.custom<File>())
      .refine(
         (files) => files.every((file) => file instanceof File),
         "Expected a file.",
      )
      .refine(
         (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
         `File size should be less than 5MB.`,
      )
      .refine(
         (files) =>
            files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
         "Only these types are allowed .jpg, .jpeg, .png and .webp",
      )
      .optional(),
});

export const serverPhotoValidator = z.object({
   photos: z.array(z.string()).optional(),
});

export const laundryItemValidator = z.object({
   quantity: z.number(),
   clothingId: z.string().uuid(),
});

export const laundryEventValidator = z.object({
   created: z.date().default(new Date()),
   items: z.array(laundryItemValidator),
});
