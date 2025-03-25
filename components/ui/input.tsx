import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base
        "flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",

        // Colores base
        "bg-white text-black placeholder:text-gray-500",
        "dark:bg-shark-800 dark:text-white dark:placeholder:text-gray-400",

        // Border & ring
        "border-gray-300 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "dark:border-shark-600 dark:focus-visible:border-ring dark:focus-visible:ring-ring/50",

        // Invalid
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20 dark:aria-invalid:border-red-500 dark:aria-invalid:ring-red-500/40",

        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none",

        // File input
        "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",

        // Text selection
        "selection:bg-primary selection:text-primary-foreground",

        className
      )}
      {...props}
    />
  );
}

export { Input };
