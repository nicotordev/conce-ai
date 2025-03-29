import React from "react";
import clsx from "clsx";

// Skeleton components
const SkeletonTitle = () => (
  <div className="tw-absolute tw-left-1/2 -tw-translate-x-1/2 -tw-top-12 tw-z-50">
    <div className="tw-h-8 tw-w-64 tw-bg-gray-200 tw-rounded-md tw-animate-pulse dark:tw-bg-shark-700"></div>
  </div>
);

const SkeletonInput = () => (
  <div className="tw-h-16 tw-w-full tw-bg-gray-100 tw-rounded-md tw-animate-pulse dark:tw-bg-shark-700"></div>
);

const SkeletonButton = () => (
  <div className="tw-rounded-full tw-aspect-square tw-w-9 tw-h-9 tw-bg-gray-200 tw-animate-pulse dark:tw-bg-shark-700"></div>
);

const AppChatFormSkeleton = ({ isInitialChat = true }) => {
  return (
    <div
      className={clsx(
        "tw-text-center md:tw-flex tw-flex-col tw-gap-4 max-md:tw-fixed max-md:tw-bottom-0 max-md:tw-w-screen max-md:tw-rounded-none tw-w-full tw-relative",
        {
          ["tw-mt-24"]: isInitialChat,
        }
      )}
    >
      {isInitialChat && <SkeletonTitle />}

      <div className="tw-p-2 tw-min-w-2xl tw-rounded-lg tw-shadow-md tw-w-full md:tw-max-w-4xl tw-border tw-border-gray-300 dark:tw-border-shark-700 tw-mx-auto tw-bg-white dark:tw-bg-shark-800">
        <div className="tw-relative tw-w-full tw-max-w-full tw-pb-3">
          <SkeletonInput />
        </div>
        <div className="tw-flex tw-items-center tw-justify-end">
          <SkeletonButton />
        </div>
      </div>
    </div>
  );
};

export default AppChatFormSkeleton;
