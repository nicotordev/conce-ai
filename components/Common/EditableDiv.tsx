"use client";
import { useUploadFiles } from "@/providers/UploadFilesProvider";
/* eslint-disable jsx-a11y/no-static-element-interactions */
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

  return (
    <>
      <div className="relative">
        {files.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {files.map((file) => (
              <div
                key={JSON.stringify(file)}
                className="relative w-10 h-10 flex items-center justify-center border rounded bg-white"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {Boolean(file.type.toLowerCase().includes("image")) ? (
                        <Image
                          src={file.preview}
                          alt={file.name}
                          width={32}
                          height={32}
                          className="object-contain rounded"
                        />
                      ) : (
                        <file.icon size={20} />
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
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded z-10">
                    <Spinner />
                  </div>
                )}

                {file.status === "error" && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-red-500 rounded z-10">
                    <CgDanger size={20} />
                  </div>
                )}
                <button
                  className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1 hover:bg-primary-600 hover:text-white focus:bg-primary-600 focus:text-white cursor-pointer transition-colors duration-150"
                  type="button"
                  onClick={() => handleFileDeletion(file)}
                >
                  <CgClose className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative">
          {!value && (
            <span className="absolute left-3 top-3 text-gray-400 pointer-events-none select-none">
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
              "relative w-full p-3 focus:outline-none text-left break-words whitespace-pre-wrap max-h-40 bg-white"
            }
            data-placeholder={placeholder}
          />
        </div>
      </div>
    </>
  );
};

export default EditableDiv;
