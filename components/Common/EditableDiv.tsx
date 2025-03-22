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
    onChange(e.currentTarget.textContent || "");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Enter sin Shift → enviar (prevenir salto de línea)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const text = divRef.current?.textContent?.trim();
      if (text) {
        // Simula submit del formulario más cercano
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
    // Shift+Enter → permite salto de línea (no hacemos nada)
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
        className={
          className ||
          "relative w-full p-3 bg-transparent focus:outline-none text-left break-words whitespace-pre-wrap"
        }
        data-placeholder={placeholder}
      />
    </>
  );
};

export default EditableDiv;
