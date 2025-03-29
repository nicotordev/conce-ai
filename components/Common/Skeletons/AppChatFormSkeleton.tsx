import React from "react";
import clsx from "clsx";

// Skeleton components
const SkeletonTitle = () => (
  <div className="absolute left-1/2 -translate-x-1/2 -top-12 z-50">
    <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse dark:bg-shark-700"></div>
  </div>
);

const SkeletonInput = () => (
  <div className="h-16 w-full bg-gray-100 rounded-md animate-pulse dark:bg-shark-700"></div>
);

const SkeletonButton = () => (
  <div className="rounded-full aspect-square w-9 h-9 bg-gray-200 animate-pulse dark:bg-shark-700"></div>
);

const AppChatFormSkeleton = ({ isInitialChat = true }) => {
  return (
    <div
      className={clsx(
        "text-center md:flex flex-col gap-4 max-md:fixed max-md:bottom-0 max-md:w-screen max-md:rounded-none w-full relative",
        {
          ["mt-24"]: isInitialChat,
        }
      )}
    >
      {isInitialChat && <SkeletonTitle />}

      <div className="p-2 min-w-2xl rounded-lg shadow-md w-full md:max-w-4xl border border-gray-300 dark:border-shark-700 mx-auto bg-white dark:bg-shark-800">
        <div className="relative w-full max-w-full pb-3">
          <SkeletonInput />
        </div>
        <div className="flex items-center justify-end">
          <SkeletonButton />
        </div>
      </div>
    </div>
  );
};

export default AppChatFormSkeleton;
