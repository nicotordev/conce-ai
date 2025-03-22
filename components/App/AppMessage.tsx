import { memo } from "react";
import MarkdownRenderer from "../Common/MarkdownRenderer";
import { MessageSender } from "@prisma/client";
import { AppMessageProps } from "@/types/app";
import { Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import clsx from "clsx";
const AppMessage = memo(
  ({ message, isLastIndex, isPending }: AppMessageProps) => {
    if (message.sender === MessageSender.USER) {
      return (
        <Transition
          as="div"
          show={true} // Siempre visible, pero animamos la entrada
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <div className="flex justify-end px-2">
            <div className="bg-white px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm max-w-[75%] break-words whitespace-pre-wrap mt-4">
              {message.content}
            </div>
          </div>
        </Transition>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-start px-2 w-5/6"
      >
        <div
          className={clsx(
            "px-5 py-2.5 max-w-full prose flex items-start gap-2",
            isLastIndex && isPending ? "blur-xl" : ""
          )}
        >
          <MarkdownRenderer
            key={`${message.content}-${message.isTyping}`}
            content={
              isLastIndex && isPending
                ? "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit quia rem amet blanditiis eum beatae. Dolores quo id perspiciatis sint?"
                : message.content
            }
          />
        </div>
      </motion.div>
    );
  }
);

AppMessage.displayName = "AppMessage";

export default AppMessage;
