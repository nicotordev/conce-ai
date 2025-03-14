import { SignInPageStep, SignUpPageStep } from "./auth.enum";
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

export type { SignUpState, SignUpProps, SignInState, SignInProps };
