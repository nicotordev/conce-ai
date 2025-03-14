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

export { SignUpPageStep, SignInPageStep, EmailVerificationStep };
