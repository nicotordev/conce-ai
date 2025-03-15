enum SignUpPageStep {
  email = "email",
  password = "password",
}

enum SignInPageStep {
  email = "email",
  password = "password",
}

enum EmailVerificationStep {
  start = "start",
  success = "success",
  error = "error",
  expired = "expired",
}

enum ResetPasswordStep {
  email = "email",
  resend = "resend",
  reset = "reset",
  expired = "expired",
}

export {
  SignUpPageStep,
  SignInPageStep,
  EmailVerificationStep,
  ResetPasswordStep,
};
