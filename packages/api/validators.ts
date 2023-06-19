import { z } from "zod";

export const newAdminUserValidator = z.object({
   email: z.string().email(),
   name: z.string(),
   password: z.string().min(6),
});
