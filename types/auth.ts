import { EmailVerificationStep, SignInPageStep, SignUpPageStep } from "./auth.enum";
type SignUpState = {
  step: SignUpPageStep;
  email: string;
  password: string;
} | null;
type SignUpProps = {
  state: {
    step: SignUpPageStep;
    email: string;
    password: string;
  } | null;
};

type SignInState = {
  step: SignInPageStep;
  email: string;
  password: string;
} | null;
type SignInProps = {
  state: SignInState | null;
};

type EmailVerificationState = {
  code: string;
} | null;

type EmailVerificationProps = {
  step: EmailVerificationStep;
  state: EmailVerificationState;
};

export type {
  SignUpState,
  SignUpProps,
  SignInState,
  SignInProps,
  EmailVerificationState,
  EmailVerificationProps,
};
