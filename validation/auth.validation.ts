import authConstants from "@/constants/auth.constants";
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
  email: z.string().email(authConstants.ERROR_MESSAGES_CODES.INVALID_CREDENTIALS),
  password: z.string().min(1, authConstants.ERROR_MESSAGES_CODES.INVALID_CREDENTIALS),
});

const EmailVerificationSchema = z.object({
  userId: z.string().min(1, authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR),
  code: z
    .string()
    .min(1, authConstants.ERROR_MESSAGES_CODES.INVALID_VERIFICATION_TOKEN),
});

const EmailResendSchema = z.object({
  userId: z.string().min(1, authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR),
});


export { PasswordSchema, CredentialsSchema, EmailVerificationSchema, EmailResendSchema };
