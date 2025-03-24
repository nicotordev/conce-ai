"use client";
import { AppAsistantMessageProps } from "@/types/app";
import MarkdownRenderer from "../Common/MarkdownRenderer";
import { motion } from "framer-motion";
import clsx from "clsx";
import Image from "next/image";
import { condorPng } from "@/assets";
import { useEffect, useRef } from "react";

export default function AppAsistantMessage({
  isLastIndex,
  isPending,
  content,
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

  const iconClasses = clsx(
    "object-contain object-center",
    isPending ? "animate-spin" : ""
  );

  const condorBubbleClasses = clsx(
    "absolute -bottom-10 left-6 z-50 p-1 rounded-full shadow-sm aspect-square flex items-center justify-center",
    "bg-white border border-silver-300 dark:bg-shark-700 dark:border-shark-600"
  );

  return (
    <div className="relative my-4" ref={contentRef}>
      {isLastIndex ? (
        <>
          <div className="flex justify-start px-2 w-5/6">
            <div className={contentClasses}>
              <MarkdownRenderer content={content} />
            </div>
          </div>
          <div className={condorBubbleClasses}>
            <Image src={condorPng} alt="Condor" width={35} height={35} className={iconClasses} />
          </div>
        </>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-start px-2 w-5/6"
          >
            <div className={contentClasses}>
              <MarkdownRenderer content={content} />
            </div>
          </motion.div>
          {isLastIndex && (
            <div className={condorBubbleClasses}>
              <Image src={condorPng} alt="Condor" width={35} height={35} className={iconClasses} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
