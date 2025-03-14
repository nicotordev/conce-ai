const authConstants = {
  SESSION_MAX_AGE: 60 * 60 * 24 * 30,
  PROTECTED_PATHS: ["/dashboard"],
  ERROR_MESSAGES_CODES: {
    INVALID_CREDENTIALS: "invalid-credentials",
    USER_NOT_FOUND: "user-not-found",
    USER_ALREADY_EXISTS: "user-exists",
    ERROR_SIGN_UP_TOKEN:  "error-sign-up-token",
    INTERNAL_SERVER_ERROR: "internal-server-error",
    INVALID_VERIFICATION_TOKEN: "invalid-verification-token",
    EXPIRED_VERIFICATION_TOKEN: "expired-verification-token",
    INVALID_USER: "invalid user",
  },
  SUCCESS_MESSAGES_CODES: {
    SIGN_UP: "account-created",
    SIGN_IN: "signed-in",
    SIGN_OUT: "signed-out",
    SIGN_UP_REDIRECT: "account-created-redirect",
    EMAIL_RESEND: "email-resend",
  }
};
export default authConstants;
