import { IconType } from "react-icons/lib";

type ConceAIDropdownProps = {
  button: React.ReactNode;
  items: {
    icon: IconType;
    text: string;
    type?: "danger" | undefined;
    action: () => void;
  }[];
  variant: "default" | "destructive" | "secondary" | "white" | "transparent-white" | undefined;
};

export type { ConceAIDropdownProps };
