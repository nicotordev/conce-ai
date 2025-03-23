import { AppAsistantMessageProps } from "@/types/app";
import MarkdownRenderer from "../Common/MarkdownRenderer";
import { motion } from "framer-motion";
import clsx from "clsx";
import Image from "next/image";
import { condorPng } from "@/assets";

export default function AppAsistantMessage({
  isLastIndex,
  isPending,
  content,
}: AppAsistantMessageProps) {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-start px-2 w-5/6"
      >
        <div
          className={clsx(
            "px-5 py-2.5 max-w-full prose flex items-start gap-2"
          )}
        >
          <MarkdownRenderer content={content} />
        </div>
      </motion.div>
      {isLastIndex && (
        <div className="absolute -bottom-10 left-6 z-50 p-1 bg-white rounded-full shadow-sm aspect-square flex items-center justify-center border border-silver-300">
          <Image
            src={condorPng}
            alt="Condor"
            width={35}
            height={35}
            className={clsx(
              "object-contain object-center",
              isPending ? "animate-spin" : ""
            )}
          />
        </div>
      )}
    </div>
  );
}
