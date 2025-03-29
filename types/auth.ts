import { Session } from "next-auth";
import {
  EmailVerificationStep,
  ResetPasswordStep,
  SignInPageStep,
  SignUpPageStep,
} from "./auth.enum";
type SignUpState = {
  step: SignUpPageStep;
  email: string;
  password: string;
  error: string;
} | null;
type SignUpProps = {
  state: SignUpState;
};

type SignInState = {
  step: SignInPageStep;
  email: string;
  password: string;
  error: string;
} | null;
type SignInProps = {
  state: SignInState | null;
};

type EmailVerificationState = {
  step: EmailVerificationStep;
  code: string;
  userId: string;
  error: string;
  email: string;
} | null;

type EmailVerificationProps = {
  state: EmailVerificationState;
  session: Session | null;
};

type EmailVerificationModalProps = {
  email: string;
  loading: boolean;
  handleStep: (step: EmailVerificationStep, error?: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
};

type ResetPasswordState = {
  step: ResetPasswordStep;
  email: string;
  error: string;
  password: string;
  token: string;
};

type ResetPasswordProps = {
  state: ResetPasswordState;
};

type AuthErrorProps = {
  error?: string | null;
};

type AuthLoadingProps = {
  loading: boolean;
};
type AuthTokenExpiredProps = {
  show: boolean;
  children?: React.ReactNode;
};

type AuthAppIdeasProps = {
  ideas: string[];
};

type IdeaMarkdownRendererProps = {
  content: string;
};

export type {
  SignUpState,
  SignUpProps,
  SignInState,
  SignInProps,
  EmailVerificationState,
  EmailVerificationProps,
  EmailVerificationModalProps,
  ResetPasswordState,
  ResetPasswordProps,
  AuthErrorProps,
  AuthLoadingProps,
  AuthTokenExpiredProps,
  AuthAppIdeasProps,
  IdeaMarkdownRendererProps,
};
