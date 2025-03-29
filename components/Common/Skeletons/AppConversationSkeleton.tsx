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
    <div className="tw-flex tw-flex-col tw-gap-4 tw-px-2 tw-py-4">
      {bubbles.map((bubble, index) => {
        const isUser = bubble.sender === "user";

        return (
          <div
            key={index}
            className={`tw-flex ${
              isUser ? "tw-justify-end" : "tw-justify-start"
            }`}
          >
            <div
              className={clsx(
                "tw-w-fit tw-max-w-[75%] tw-animate-pulse",
                isUser
                  ? "tw-bg-white tw-dark:bg-shark-700 tw-border tw-border-gray-200 tw-dark:border-shark-600 tw-shadow-sm tw-rounded-xl tw-px-5 tw-py-2.5"
                  : "tw-prose tw-px-2 tw-py-1 tw-bg-gray-100 tw-dark:bg-shark-800 tw-rounded-md"
              )}
            >
              <div
                className={clsx(
                  "tw-flex tw-flex-col tw-gap-2 tw-text-gray-500 tw-dark:text-shark-200",
                  {
                    ["tw-blur-xs"]: Boolean(bubble.message) === false,
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
                        className="tw-h-4 tw-bg-gray-200 tw-rounded-md dark:tw-bg-shark-700"
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
