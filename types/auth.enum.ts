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
  expired = "expired",
}

enum ResetPasswordStep {
  email = "email",
  resend = "resend",
  reset = "reset",
  expired = "expired",
  success = "success",
}

export {
  SignUpPageStep,
  SignInPageStep,
  EmailVerificationStep,
  ResetPasswordStep,
};
