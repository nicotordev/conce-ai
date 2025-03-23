import { IconType } from "react-icons/lib";

type CondorDropdownProps = {
  button: React.ReactNode;
  items: {
    icon: IconType;
    text: string;
    type?: "danger" | undefined;
  }[];
  variant: "default" | "destructive" | "secondary" | "white" | "transparent-white" | undefined;
};

export type { CondorDropdownProps };
