import {
  EmailVerificationStep,
  SignInPageStep,
  SignUpPageStep,
} from "./auth.enum";
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
  step: EmailVerificationStep;
  code: string;
  userId: string;
  error: string;
} | null;

type EmailVerificationProps = {
  state: EmailVerificationState;
};

type EmailVerificationModalProps = {
  loading: boolean;
};
export type {
  SignUpState,
  SignUpProps,
  SignInState,
  SignInProps,
  EmailVerificationState,
  EmailVerificationProps,
  EmailVerificationModalProps
};
