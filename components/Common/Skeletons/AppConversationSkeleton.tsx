import {
  AppConversationSkeletonBubble,
  AppConversationSkeletonProps,
} from "@/types/app";
import clsx from "clsx";
import { motion } from "framer-motion";

const AppConversationSkeleton = ({
  bubblesParam,
}: AppConversationSkeletonProps) => {
  const bubbles: AppConversationSkeletonBubble[] = bubblesParam
    ? bubblesParam
    : (Array.from({ length: 5 }, (_, index) => ({
        sender: index % 2 === 0 ? "user" : "ia",
        lines: Math.floor(Math.random() * 3) + 1,
        message: index === 4 && index % 2 !== 0 ? "" : "Texto de prueba",
      })) as AppConversationSkeletonBubble[]);

  return bubbles.map((bubble, index) => {
    const isUser = bubble.sender === "user";

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className={clsx("flex", {
          "justify-end": isUser,
          "justify-start": !isUser,
        })}
      >
        {isUser ? (
          <div className="flex justify-end px-2">
            <div
              className={clsx(
                "bg-white dark:bg-shark-700 text-black dark:text-white px-5 py-2.5 rounded-xl border border-gray-200 dark:border-shark-600 shadow-sm max-w-[75%] break-words whitespace-pre-wrap mt-4"
              )}
            >
              {bubble.message}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-shark-800 border border-gray-200 dark:border-shark-600 shadow-sm max-w-[75%] mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-gray-400"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    );
  });
};

export default AppConversationSkeleton;
