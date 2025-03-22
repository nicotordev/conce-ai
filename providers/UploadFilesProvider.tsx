/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
"use client";

import React, {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CondorAIProviderProps,
  UploadFilesContextType,
} from "@/types/providers";
import { NicoDropzoneFile } from "@nicotordev/nicodropzone/dist/types";
import condorAi from "@/lib/condor-ai";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import { uploadFileSvg } from "@/assets";
// Crea el contexto
const UploadFilesContext = createContext<UploadFilesContextType | null>(null);

// Hook personalizado para usar el contexto en los componentes hijos
export const useUploadFiles = () => {
  const context = useContext(UploadFilesContext);
  if (!context) {
    throw new Error(
      "useUploadFiles debe ser usado dentro de un UploadFilesProvider"
    );
  }
  return context;
};

export const UploadFilesProvider = ({ children }: CondorAIProviderProps) => {
  const [files, setFiles] = useState<NicoDropzoneFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const dragCounter = useRef(0);

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      for (const file of Array.from(e.dataTransfer.files)) {
        handleFileUpload(file);
      }
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items || [];
    for (const item of items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) {
          handleFileUpload(file);
          e.preventDefault();
        }
      }
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileUpload = async (file: File) => {
    const newFile = await condorAi.user.uploadFile(file);
    if (newFile) {
      setFiles((prevFiles) => [...prevFiles, newFile]);
    }
  };
  useEffect(() => {
    const nativeHandlePaste = (e: ClipboardEvent) => handlePaste(e);
    const nativeHandleDragOver = (e: DragEvent) => handleDragOver(e);
    const nativeHandleDrop = (e: DragEvent) => handleDrop(e);
    const nativeHandleDragEnter = (e: DragEvent) => handleDragEnter(e);
    const nativeHandleDragLeave = (e: DragEvent) => handleDragLeave(e);

    document.addEventListener("paste", nativeHandlePaste);
    document.addEventListener("dragover", nativeHandleDragOver);
    document.addEventListener("drop", nativeHandleDrop);
    document.addEventListener("dragenter", nativeHandleDragEnter);
    document.addEventListener("dragleave", nativeHandleDragLeave);

    return () => {
      document.removeEventListener("paste", nativeHandlePaste);
      document.removeEventListener("dragover", nativeHandleDragOver);
      document.removeEventListener("drop", nativeHandleDrop);
      document.removeEventListener("dragenter", nativeHandleDragEnter);
      document.removeEventListener("dragleave", nativeHandleDragLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UploadFilesContext.Provider value={{ files }}>
      {children}
      <Transition
        show={isDragging}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        as={Fragment}
      >
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center w-screen h-screenpointer-events-none">
          <div className="flex items-center gap-4">
            <Image src={uploadFileSvg} width={200} height={200} alt="Upload file illustration" />
            <p className="!text-white">
              <strong>Agrega cualquier elemento</strong>
              <br />
              Arrastra y suelta archivos o imágenes aquí
            </p>
          </div>
        </div>
      </Transition>
    </UploadFilesContext.Provider>
  );
};
