import { z } from "zod";

const PasswordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(64, "La contraseña no puede tener más de 64 caracteres")
  .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
  .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
  .regex(/[0-9]/, "Debe contener al menos un número")
  .regex(
    /[@$!%*?&._\-]/,
    "Debe contener al menos un carácter especial (@$!%*?&._-)"
  )
  .regex(/^\S+$/, "No puede contener espacios");

const CredentialsSchema = z.object({
  username: z
    .string()
    .min(1, "El username no puede estar vacío")
    .max(20, "El username no puede tener más de 20 caracteres")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "El username solo puede contener letras, números, '.', '_' y '-'"
    ),
  password: z.string().min(1, "La contraseña no puede estar vacía"),
});

export { PasswordSchema, CredentialsSchema };
