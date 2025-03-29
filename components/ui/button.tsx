import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow-xs hover:bg-primary/90 font-semibold dark:bg-primary-700 dark:text-white dark:hover:bg-primary-800",
        destructive:
          "font-semibold bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-red-800 dark:text-white dark:hover:bg-red-700",
        outline:
          "font-semibold border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-shark-800 dark:border-shark-600 dark:text-white dark:hover:bg-shark-700",
        secondary:
          "font-semibold bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 dark:bg-secondary-700 dark:text-white dark:hover:bg-secondary-800",
        ghost:
          "font-semibold hover:bg-accent hover:text-accent-foreground dark:text-white dark:hover:bg-shark-600",
        link: "font-semibold text-primary underline-offset-4 hover:underline dark:text-white",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  } & {
    href?: string;
  }) {
  const { href, ...rest } = props;
  const Comp = asChild ? Slot : "button";

  if (href) {
    return (
      <Link
        data-slot="button"
        href={href}
        className={cn(buttonVariants({ variant, size, className }))}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...rest}
    />
  );
}

export { Button, buttonVariants };
