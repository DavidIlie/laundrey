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

export const categoryValidator = z.object({
   name: z.string(),
   description: z.string().optional(),
   tags: z.array(z.string()),
   category: z.array(z.string()),
});
