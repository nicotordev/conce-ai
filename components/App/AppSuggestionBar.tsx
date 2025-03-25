import { AppSuggestionBarProps } from "@/types/app";
import { motion } from "framer-motion";

const AppSuggestionBar = ({
  handleQuery,
  suggestions,
}: AppSuggestionBarProps) => {
  return (
    <div className="text-center max-w-4xl mx-auto mt-24">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white"
      >
        ¿En qué puedo ayudarte hoy?
      </motion.h2>

      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((s, index) => (
          <motion.button
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg
              border border-transparent shadow-sm text-sm transition-colors
              hover:opacity-90 bg-gray-500 hover:bg-gray-600 text-white
              dark:bg-shark-700 dark:hover:bg-shark-600 dark:text-white
              basis-[calc(25%-0.5rem)] cursor-pointer
            `}
            onClick={() => handleQuery?.(s.label)}
          >
            {s.icon}
            <span className="text-gray-800 dark:text-white">{s.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default AppSuggestionBar;
