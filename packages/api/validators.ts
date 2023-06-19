import { z } from "zod";

export const newUserValidator = z.object({
   email: z.string().email(),
   name: z.string(),
   password: z.string().min(6),
});
