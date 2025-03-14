"use client";
import { Fragment, useState } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { CgDanger } from "react-icons/cg";
import { InputProps } from "@/types/common";
import { Transition } from "@headlessui/react";
import { BsCheck } from "react-icons/bs";

export default function Input({
  rightIcon,
  leftIcon,
  label,
  error,
  validations = {
    items: [],
    show: false,
    title: "Validaciones",
  },
  ...rest
}: InputProps) {
  const [isOnFocus, setIsOnFocus] = useState(false);
  return (
    <div>
      <label
        htmlFor="hs-leading-icon"
        className="block text-sm font-medium mb-2 dark:text-white"
      >
        {label}
      </label>
      <div className="flex flex-col">
        <div className="relative">
          <input
            {...rest}
            className={twMerge(
              "py-2.5 sm:py-3 px-4 ps-11 block w-full border-gray-400 rounded-lg sm:text-sm focus:z-10 disabled:opacity-50 disabled:pointer-events-none read-only:opacity-50 read-only:pointer-events-none read-only:bg-gray-200 disabled:bg-gray-200",
              "focus:border-primary-500 focus:ring-primary-500 ",
              rest.className
            )}
            onFocus={() => setIsOnFocus(true)}
            onBlur={() => setIsOnFocus(false)}
          />
          <div className="absolute inset-y-0 start-0 flex items-center z-20 ps-4">
            <div
              className={clsx("shrink-0 size-4 text-base", {
                ["text-gray-400"]: !isOnFocus,
                ["text-primary-500"]: isOnFocus,
              })}
            >
              {leftIcon}
            </div>
          </div>
          <div className="absolute inset-y-0 end-4 flex items-center z-20 ps-4">
            <div
              className={clsx("shrink-0 size-4 text-base", {
                ["text-gray-400"]: !isOnFocus,
                ["text-primary-500"]: isOnFocus,
              })}
            >
              {rightIcon}
            </div>
          </div>
        </div>
        {error && (
          <span className="mt-2 text-sm text-danger-500">
            <CgDanger className="inline-block size-4" />
          </span>
        )}
      </div>
      <Transition
        show={validations.show}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        as={Fragment}
      >
        <ul
          className={clsx(
            "flex flex-col bg-white p-4 rounded-lg mt-4 border border-solid border-gray-300"
          )}
        >
          <li className="font-inter font-semibold text-dark-text-accent mb-2 text-sm">
            {validations.title}
          </li>
          {validations.items.map((validation) => (
            <li
              key={`${validation.message}-${validation.isValid}`}
              className={clsx(
                "text-xs tw-3 flex items-center gap-2",
                validation.isValid ? "text-primary-600" : "text-gray-800"
              )}
            >
              <BsCheck />
              {validation.message}
            </li>
          ))}
        </ul>
      </Transition>
    </div>
  );
}
