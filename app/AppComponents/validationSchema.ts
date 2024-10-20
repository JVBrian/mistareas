import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email({ message: "Por favor, ingrese un correo valido" }),

  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export const signUpSchema = authSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas deben coincidir",
    path: ["confirmPassword"],
  });
