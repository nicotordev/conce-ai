/* eslint-disable @typescript-eslint/no-unused-vars */
import authConstants from "@/constants/auth.constants";
/* [TODO]: Implement locale) */
/*

  ERROR_MESSAGES_CODES: {
    INVALID_CREDENTIALS: "invalid-credentials",
    USER_NOT_FOUND: "user-not-found",
    USER_ALREADY_EXISTS: "user-exists",
    ERROR_SIGN_UP_TOKEN:  "error-sign-up-token",
    INTERNAL_SERVER_ERROR: "internal-server-error",
    INVALID_VERIFICATION_TOKEN: "invalid-verification-token",
    EXPIRED_VERIFICATION_TOKEN: "expired-verification-token",
    INVALID_USER: "invalid user",
    INVALID_RESET_PASSWORD_TOKEN: "invalid-reset-password-token",
    EXPIRED_RESET_PASSWORD_TOKEN: " expired-reset-password-token",
  },
*/
function getAuthErrorMessage(error: string, _locale?: string) {
  const foundValue =
    Object.values(authConstants.ERROR_MESSAGES_CODES).find(
      (value) => value === error
    ) || authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR;

  if (foundValue) {
    switch (foundValue) {
      case authConstants.ERROR_MESSAGES_CODES.INVALID_CREDENTIALS:
        return "Credenciales invalidas o incorrectas";
      case authConstants.ERROR_MESSAGES_CODES.USER_NOT_FOUND:
        return "Usuario no encontrado";
      case authConstants.ERROR_MESSAGES_CODES.USER_ALREADY_EXISTS:
        return "El usuario ya existe";
      case authConstants.ERROR_MESSAGES_CODES.ERROR_SIGN_UP_TOKEN:
        return "Ha ocurrido un error al crear la cuenta";
      case authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR:
        return "Ha ocurrido un error en el servidor";
      case authConstants.ERROR_MESSAGES_CODES.INVALID_VERIFICATION_TOKEN:
        return "Token de verificación invalido";
      case authConstants.ERROR_MESSAGES_CODES.EXPIRED_VERIFICATION_TOKEN:
        return "Token de verificación expirado";
      case authConstants.ERROR_MESSAGES_CODES.INVALID_USER:
        return "Usuario invalido";
      case authConstants.ERROR_MESSAGES_CODES.INVALID_RESET_PASSWORD_TOKEN:
        return "Token de restablecimiento de contraseña invalid o incorrecto";
      case authConstants.ERROR_MESSAGES_CODES.EXPIRED_RESET_PASSWORD_TOKEN:
        return "Código de restablecimiento de contraseña expirado";
      default:
        return "Ha ocurrido un error inesperado, por favor intenta de nuevo";
    }
  }

  return "Ha ocurrido un error inesperado, por favor intenta de nuevo";
}

export { getAuthErrorMessage };
