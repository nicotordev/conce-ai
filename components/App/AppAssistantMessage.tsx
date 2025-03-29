"use client";
import { AppAsistantMessageProps } from "@/types/app";
import MarkdownRenderer from "../Common/MarkdownRenderer";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useEffect, useRef } from "react";

export default function AppAsistantMessage({
  isLastIndex,
  content,
  markdown,
}: AppAsistantMessageProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const contentScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLastIndex) {
      contentScrollTimeout.current = setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

      return () => {
        if (contentScrollTimeout.current) {
          clearTimeout(contentScrollTimeout.current);
        }
      };
    }
  }, [isLastIndex]);

  const contentClasses = clsx(
    "px-5 py-2.5 max-w-full prose dark:prose-invert flex items-start gap-2",
    "bg-white dark:bg-shark-800 rounded-lg shadow-sm border border-gray-200 dark:border-shark-700"
  );

  return (
    <div className="relative my-4" ref={contentRef}>
      {isLastIndex ? (
        <>
          <div className="flex justify-start px-2 w-5/6">
            <div className={contentClasses}>
              {markdown ? markdown : <MarkdownRenderer content={content} />}
            </div>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-start px-2 w-5/6"
        >
          <div className={contentClasses}>
            {markdown ? markdown : <MarkdownRenderer content={content} />}
          </div>
        </motion.div>
      )}
    </div>
  );
}
