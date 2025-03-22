/* eslint-disable jsx-a11y/no-static-element-interactions */
import { EditableDivProps } from "@/types/common";
import { useRef, useEffect } from "react";

const EditableDiv = ({
  value,
  onChange,
  placeholder,
  className,
}: EditableDivProps) => {
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

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (const file of Array.from(e.dataTransfer.files)) {
        handleFileUpload(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileUpload = (file: File) => {
    // Aquí puedes procesar el archivo como necesites
    console.log("Archivo recibido:", file);
    // Puedes emitir un evento personalizado o llamar a otro callback si es necesario
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
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={
          className ||
          "relative w-full p-3 bg-transparent focus:outline-none text-left break-words whitespace-pre-wrap max-h-40"
        }
        data-placeholder={placeholder}
      />
    </>
  );
};

export default EditableDiv;
