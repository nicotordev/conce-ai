"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  FiAlertTriangle,
  FiMessageSquare,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiInfo,
} from "react-icons/fi";

// Define modal types
export type ModalType =
  | "alert"
  | "message"
  | "success"
  | "error"
  | "warning"
  | "info";

// Define modal data structure
interface ModalData {
  title: string;
  description?: string;
  type: ModalType;
  content?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
}

// Define context type
interface ModalContextType {
  openModal: (data: ModalData) => void;
  closeModal: () => void;
  setModalData: React.Dispatch<React.SetStateAction<ModalData | null>>;
}

// Create context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Size class mapping
const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

// Type class mapping
const typeClasses = {
  alert: "border-l-4 border-l-destructive",
  message: "border-l-4 border-l-primary",
  success: "border-l-4 border-l-secondary",
  error: "border-l-4 border-l-destructive",
  warning: "border-l-4 border-l-chart-1",
  info: "border-l-4 border-l-muted",
};

// Icon components for each type with background
const TypeIcon = ({ type }: { type: ModalType }) => {
  const getIconComponent = () => {
    switch (type) {
      case "alert":
        return <FiAlertTriangle className="w-6 h-6" />;
      case "success":
        return <FiCheckCircle className="w-6 h-6" />;
      case "error":
        return <FiXCircle className="w-6 h-6" />;
      case "warning":
        return <FiAlertCircle className="w-6 h-6" />;
      case "info":
        return <FiInfo className="w-6 h-6" />;
      case "message":
      default:
        return <FiMessageSquare className="w-6 h-6" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "alert":
      case "error":
        return "bg-destructive/10 text-destructive";
      case "success":
        return "bg-secondary/10 text-secondary";
      case "warning":
        return "bg-chart-1/10 text-chart-1";
      case "info":
        return "bg-muted/10 text-muted-foreground";
      case "message":
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <div
      className={`flex items-center justify-center w-10 h-10 rounded-full ${getBgColor()}`}
    >
      {getIconComponent()}
    </div>
  );
};

// Condor-AI Logo component
const CondorLogo = () => (
  <div className="flex items-center font-title text-lg font-bold text-primary">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-2"
    >
      <path
        d="M12 2L3 9L5 20L19 20L21 9L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 9.5C9 8.12 10.12 7 11.5 7C12.88 7 14 8.12 14 9.5C14 10.88 12.88 12 11.5 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="11.5"
        y1="12"
        x2="11.5"
        y2="16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
    Condor-AI
  </div>
);

// Modal Provider Component
export const CondorAIModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const openModal = (data: ModalData) => {
    setModalData(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, setModalData }}>
      {children}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className={cn(
            modalData?.type && typeClasses[modalData.type],
            modalData?.size && sizeClasses[modalData.size || "md"],
            "p-0 overflow-hidden"
          )}
        >
          {modalData?.showCloseButton !== false && (
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted/20 text-muted-foreground transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="p-6">
            <DialogHeader className="flex flex-row items-start space-y-0 gap-4">
              {modalData?.type && <TypeIcon type={modalData.type} />}

              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <CondorLogo />
                </div>
                <DialogTitle className="text-lg font-semibold mb-2">
                  {modalData?.title}
                </DialogTitle>
                {modalData?.description && (
                  <DialogDescription className="text-muted-foreground">
                    {modalData.description}
                  </DialogDescription>
                )}
              </div>
            </DialogHeader>

            {modalData?.content && (
              <div className="mt-4">{modalData.content}</div>
            )}

            {modalData?.footer && (
              <DialogFooter className="mt-6 pt-4 border-t border-border">
                {modalData.footer}
              </DialogFooter>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
};

// Hook for using the modal
export const useCondorAIModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error(
      "useCondorAIModal must be used within a CondorAIModalProvider"
    );
  }
  return context;
};
