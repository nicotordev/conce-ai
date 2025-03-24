import { AppUserMessageProps } from "@/types/app";
import { motion } from "framer-motion";

export default function AppUserMessage({ content }: AppUserMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex justify-end px-2"
    >
      <div className="bg-white dark:bg-shark-700 text-black dark:text-white px-5 py-2.5 rounded-xl border border-gray-200 dark:border-shark-600 shadow-sm max-w-[75%] break-words whitespace-pre-wrap mt-4">
        {content}
      </div>
    </motion.div>
  );
}
