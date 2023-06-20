import argon2 from "argon2";

export const hashPassword = async (password: string) =>
   await argon2.hash(password);

export const verifyPasswordToHashed = async (
   hashedPassword: string,
   providedPassword: string,
) => await argon2.verify(hashedPassword, providedPassword);
