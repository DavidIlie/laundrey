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
