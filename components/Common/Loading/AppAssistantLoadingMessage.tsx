import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { motion } from "framer-motion";

export default function AppAsistantLoadingMessage() {
  return (
    <Transition
      show={true}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
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
            <div className="flex items-center gap-1">
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
          </div>
        </motion.div>
      </div>
    </Transition>
  );
}
