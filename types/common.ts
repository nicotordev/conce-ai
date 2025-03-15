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

export type { InputProps, PasswordInputProps };
