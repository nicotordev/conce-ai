import { SignUpPageStep } from "./auth.enum";
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

export type { SignUpState, SignUpProps };
