import {
  AppConversationSkeletonBubble,
  AppConversationSkeletonProps,
} from "@/types/app";
import clsx from "clsx";

const AppConversationSkeleton = ({
  bubblesParam,
}: AppConversationSkeletonProps) => {
  const bubbles: AppConversationSkeletonBubble[] = bubblesParam
    ? bubblesParam
    : Array.from({ length: 5 }, (_, index) => ({
        sender: index % 2 === 0 ? "user" : "ia",
        lines: Math.floor(Math.random() * 3) + 1,
      }));

  return (
    <div className="flex flex-col gap-4 px-2 py-4">
      {bubbles.map((bubble, index) => {
        const isUser = bubble.sender === "user";

        return (
          <div
            key={index}
            className={`flex ${
              isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={clsx(
                "w-fit max-w-[75%] animate-pulse",
                isUser
                  ? "bg-white dark:bg-shark-700 border border-gray-200 dark:border-shark-600 shadow-sm rounded-xl px-5 py-2.5"
                  : "prose px-2 py-1 bg-gray-100 dark:bg-shark-800 rounded-md"
              )}
            >
              <div
                className={clsx(
                  "flex flex-col gap-2 text-gray-500 dark:text-shark-200",
                  {
                    ["blur-xs"]: Boolean(bubble.message) === false,
                  }
                )}
              >
                {bubble.message ? (
                  bubble.message
                ) : (
                  <>
                    {/* Texto de relleno para Skeleton */}
                    {Array.from({ length: bubble.lines }).map((_, i) => (
                      <div
                        key={i}
                        className="h-4 bg-gray-200 rounded-md dark:bg-shark-700"
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AppConversationSkeleton;
