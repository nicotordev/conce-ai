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
}

export { SignUpPageStep, SignInPageStep, EmailVerificationStep };
