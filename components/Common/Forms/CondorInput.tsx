"use client";

import { Fragment, useState } from "react";
import clsx from "clsx";
import { CgDanger } from "react-icons/cg";
import { InputProps } from "@/types/common";
import { Transition } from "@headlessui/react";
import { BsCheck } from "react-icons/bs";
import { Input } from "@/components/ui/input";
import { twMerge } from "tailwind-merge";
import { Label } from "@/components/ui/label";

export default function CondorInput({
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
    <div className="w-full">
      {label && (
        <Label
          htmlFor="hs-leading-icon"
          className="block text-sm font-medium mb-2 text-gray-800 dark:text-white"
        >
          {label}
        </Label>
      )}

      <div className="flex flex-col">
        <div className="relative">
          <Input
            {...rest}
            className={twMerge(
              "bg-white text-black dark:bg-shark-800 dark:text-white dark:border-shark-600",
              leftIcon && "pl-10",
              rest.className
            )}
            onFocus={() => setIsOnFocus(true)}
            onBlur={() => setIsOnFocus(false)}
            disabled={rest.disabled}
          />

          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 start-0 flex items-center z-20 ps-4">
              <div
                className={clsx("shrink-0 size-4 text-base", {
                  "text-gray-400 dark:text-gray-500": !isOnFocus,
                  "text-primary-500": isOnFocus,
                })}
              >
                {leftIcon}
              </div>
            </div>
          )}

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute inset-y-0 end-4 flex items-center z-20 ps-4">
              <div
                className={clsx("shrink-0 size-4 text-base", {
                  "text-gray-400 dark:text-gray-500": !isOnFocus,
                  "text-primary-500": isOnFocus,
                })}
              >
                {rightIcon}
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <span className="mt-2 text-sm text-red-500">
            <CgDanger className="inline-block size-4" />
          </span>
        )}
      </div>

      {/* Validations */}
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
        <ul className="flex flex-col bg-white dark:bg-shark-800 p-4 rounded-lg mt-4 border border-solid border-gray-300 dark:border-shark-600">
          <li className="font-inter font-semibold text-dark-text-accent dark:text-white mb-2 text-sm">
            {validations.title}
          </li>
          {validations.items.map((validation) => (
            <li
              key={`${validation.message}-${validation.isValid}`}
              className={clsx(
                "text-xs flex items-center gap-2",
                validation.isValid
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-800 dark:text-gray-300"
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
