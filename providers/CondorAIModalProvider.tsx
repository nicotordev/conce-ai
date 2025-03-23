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
  footer?: (onClose: () => void, onConfirm: () => Promise<void>) => ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  onConfirm?: () => void | Promise<void>;
  body?: ReactNode;
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

// Modal Provider Component
export const CondorAIModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [onConfirm, setOnConfirm] = useState<
    (() => void | Promise<void>) | null
  >(null);

  const openModal = (data: ModalData) => {
    setModalData(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    closeModal();
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
                <DialogTitle className="text-lg font-semibold mb-2">
                  {modalData?.title}
                </DialogTitle>
                {modalData?.description && (
                  <DialogDescription className="text-muted-foreground">
                    {modalData.description}
                  </DialogDescription>
                )}
                {modalData?.body && (
                  <div className="mt-4">{modalData.body}</div>
                )}
              </div>
            </DialogHeader>

            {modalData?.content && (
              <div className="mt-4">{modalData.content}</div>
            )}

            {modalData?.footer && (
              <DialogFooter className="mt-6 pt-4 border-t border-border">
                {modalData.footer(closeModal, () => {
                  if (modalData.onConfirm) {
                    setOnConfirm(modalData.onConfirm);
                  }
                  return handleConfirm();
                })}
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
