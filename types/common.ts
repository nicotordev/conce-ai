import { Session } from "next-auth";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  label?: string;
  error?: string;
  validations?: {
    title?: string;
    items: Array<{
      isValid: boolean;
      message: string;
    }>;
    show?: boolean;
  };
};
type PasswordInputProps = {
  label?: string;
  password: string;
  setPassword: (password: string) => void;
} & Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "value" | "defaultValue"
>;

type UserProfilePicProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  session: Session | null;
};

type AppNavUserDropdownProps = {
  session: Session | null;
};

type EditableDivProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export type {
  InputProps,
  PasswordInputProps,
  UserProfilePicProps,
  AppNavUserDropdownProps,
  EditableDivProps,
};
