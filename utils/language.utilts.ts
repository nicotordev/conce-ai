import authConstants from "@/constants/auth.constants";
/* [TODO]: Implement locale) */
async function getSignInErrorMessage(error: string, locale?: string) {
  const foundValue = Object.values(authConstants.ERROR_MESSAGES_CODES).find(
    (value) => value === error
  );
  if (foundValue) {
    switch (foundValue) {
      case authConstants.ERROR_MESSAGES_CODES.INVALID_CREDENTIALS:
        return "Las credenciales ingresadas no son válidas";
      case authConstants.ERROR_MESSAGES_CODES.USER_NOT_FOUND:
        return "El usuario no existe";
      case authConstants.ERROR_MESSAGES_CODES.USER_ALREADY_EXISTS:
        return "El usuario ya existe";
      case authConstants.ERROR_MESSAGES_CODES.ERROR_SIGN_UP_TOKEN:
        return "Ha ocurrido un error al intentar crear la cuenta";
      case authConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR:
        return "Ha ocurrido un error en el servidor";
      case authConstants.ERROR_MESSAGES_CODES.INVALID_VERIFICATION_TOKEN:
        return "El token de verificación no es válido";
      case authConstants.ERROR_MESSAGES_CODES.EXPIRED_VERIFICATION_TOKEN:
        return "El token de verificación ha expirado";
      case authConstants.ERROR_MESSAGES_CODES.INVALID_USER:
        return "El usuario no es válido";
      default:
        return "Ha ocurrido un error al intentar iniciar sesión, por favor intenta de nuevo";
    }
  }

  return "Ha ocurrido un error al intentar iniciar sesión, por favor intenta de nuevo";
}

export { getSignInErrorMessage };
