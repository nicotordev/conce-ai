"use client";
import { useUploadFiles } from "@/providers/UploadFilesProvider";
import { EditableDivProps } from "@/types/common";
import Image from "next/image";
import { useRef, useEffect } from "react";
import Spinner from "./Spinner";
import { CgClose, CgDanger } from "react-icons/cg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EditableDiv = ({
  value,
  onChange,
  placeholder,
  className,
}: EditableDivProps) => {
  const { files, handleFileDeletion } = useUploadFiles();
  const divRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || "";
    if (text !== value) {
      onChange(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = divRef.current?.textContent?.trim();
      if (text) {
        const form = divRef.current?.closest("form");
        if (form) {
          const event = new Event("submit", {
            bubbles: true,
            cancelable: true,
          });
          form.dispatchEvent(event);
        }
      }
    }
  };

  useEffect(() => {
    if (divRef.current && divRef.current.textContent !== value) {
      divRef.current.textContent = value;
      moveCaretToEnd(divRef.current);
    }
  }, [value]);

  const moveCaretToEnd = (element: HTMLDivElement) => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
    element.focus();
  };

  // Custom inline styles to override Firefox focus styles
  const firefoxOverrideStyles = `
    [contenteditable]:focus {
      outline: none !important;
      box-shadow: none !important;
      border: none !important;
      -moz-outline-style: none !important;
    }
    [contenteditable]::-moz-focus-inner {
      border: 0 !important;
    }
    [contenteditable]::-moz-focus-outer {
      border: 0 !important;
    }
  `;

  return (
    <>
      {/* Firefox style override */}
      <style jsx global>
        {firefoxOverrideStyles}
      </style>

      <div className="relative" role="textbox">
        {files.length > 0 && (
          <div
            className="flex items-center gap-2 flex-wrap"
            aria-label="Attached files"
          >
            {files.map((file) => (
              <div
                key={JSON.stringify(file)}
                className="relative w-10 h-10 flex items-center justify-center border rounded bg-white"
                aria-label={`File: ${file.name}`}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      aria-label={`View details for ${file.name}`}
                    >
                      {Boolean(file.type.toLowerCase().includes("image")) ? (
                        <Image
                          src={file.preview}
                          alt={`Preview of ${file.name}`}
                          width={32}
                          height={32}
                          className="object-contain rounded"
                        />
                      ) : (
                        <file.icon size={20} aria-hidden="true" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold break-words">{file.name}</p>
                        <p className="text-muted-foreground">
                          Tipo: {file.type}
                        </p>
                        <p className="text-muted-foreground">
                          Tamaño: {file.sizeInMB.toFixed(2)} MB
                        </p>
                        <p className="text-muted-foreground capitalize">
                          Estado: {file.status}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {file.status === "uploading" && (
                  <div
                    className="absolute inset-0 bg-black/30 flex items-center justify-center rounded z-10"
                    aria-live="polite"
                    aria-label="Uploading file"
                  >
                    <Spinner aria-hidden="true" />
                  </div>
                )}

                {file.status === "error" && (
                  <div
                    className="absolute inset-0 bg-black/30 flex items-center justify-center text-red-500 rounded z-10"
                    aria-live="assertive"
                    aria-label="Error uploading file"
                  >
                    <CgDanger size={20} aria-hidden="true" />
                  </div>
                )}
                <button
                  className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1 hover:bg-primary-600 hover:text-white focus:bg-primary-600 focus:text-white cursor-pointer transition-colors duration-150"
                  type="button"
                  onClick={() => handleFileDeletion(file)}
                  aria-label={`Remove ${file.name}`}
                >
                  <CgClose className="text-xs" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative">
          {!value && (
            <span
              className="absolute left-3 top-3 text-gray-400 pointer-events-none select-none"
              aria-hidden="true"
            >
              {placeholder || "Escribe tu mensaje aquí..."}
            </span>
          )}
          <div
            ref={divRef}
            contentEditable
            translate="no"
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className={
              className ||
              "relative w-full p-3 text-left break-words whitespace-pre-wrap max-h-40 bg-white focus:outline-none focus-visible:outline-none outline-none border-none !shadow-none"
            }
            style={{ outline: "none", border: "none", boxShadow: "none" }} // Inline styles for more specificity
            role="textbox"
            aria-multiline="true"
            aria-label={placeholder || "Message input"}
            aria-placeholder={placeholder || "Escribe tu mensaje aquí..."}
            tabIndex={0}
            data-moz-user-focus="ignore" // Firefox-specific attribute
          />
        </div>
      </div>
    </>
  );
};

export default EditableDiv;
