"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
  variant?: "default" | "destructive" | "secondary" | "white" | "transparent-white";
}) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        data-variant={variant}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          "dark:bg-shark-900 dark:text-dark-text-primary dark:border-shark-700",
          "data-[variant=secondary]:bg-secondary data-[variant=secondary]:text-secondary-foreground data-[variant=secondary]:border-secondary",
          "data-[variant=secondary]:dark:bg-secondary dark:data-[variant=secondary]:text-secondary-foreground dark:data-[variant=secondary]:border-shark-700",
          "data-[variant=destructive]:bg-destructive data-[variant=destructive]:text-destructive-foreground data-[variant=destructive]:border-destructive",
          "data-[variant=destructive]:dark:bg-destructive dark:data-[variant=destructive]:text-destructive-foreground dark:data-[variant=destructive]:border-destructive",
          "data-[variant=white]:bg-[#f5f5f5] data-[variant=white]:text-[#1e293b] data-[variant=white]:border-[#e3e3e3]",
          "data-[variant=white]:dark:bg-shark-800 dark:data-[variant=white]:text-dark-text-primary dark:data-[variant=white]:border-shark-700",
          "data-[variant=transparent-white]:bg-white/80 data-[variant=transparent-white]:backdrop-blur-sm data-[variant=transparent-white]:text-[#1e293b] data-[variant=transparent-white]:border-[#efefef]",
          "data-[variant=transparent-white]:dark:bg-shark-900/80 dark:data-[variant=transparent-white]:backdrop-blur-sm dark:data-[variant=transparent-white]:text-dark-text-primary dark:data-[variant=transparent-white]:border-shark-800",
          "max-h-[600px] overflow-y-scroll",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive" | "secondary" | "white" | "transparent-white";
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground dark:focus:bg-shark-700 dark:focus:text-dark-text-primary data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive data-[variant=secondary]:text-secondary-foreground data-[variant=secondary]:focus:bg-secondary data-[variant=secondary]:focus:text-secondary-foreground dark:data-[variant=secondary]:focus:bg-secondary/90 data-[variant=secondary]:*:[svg]:!text-secondary-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-[variant=white]:text-[#1e293b] data-[variant=white]:focus:bg-[#f0f0f0] data-[variant=white]:focus:text-[#0e315d] data-[variant=white]:*:[svg]:!text-[#334155]",
        "dark:data-[variant=white]:text-dark-text-primary dark:data-[variant=white]:focus:bg-shark-800 dark:data-[variant=white]:focus:text-dark-text-accent dark:data-[variant=white]:*:[svg]:!text-dark-text-secondary",
        "data-[variant=transparent-white]:text-[#1e293b] data-[variant=transparent-white]:focus:bg-white/40 data-[variant=transparent-white]:focus:text-[#0e315d] data-[variant=transparent-white]:*:[svg]:!text-[#334155]",
        "dark:data-[variant=transparent-white]:text-dark-text-primary dark:data-[variant=transparent-white]:focus:bg-shark-800/40 dark:data-[variant=transparent-white]:focus:text-dark-text-accent dark:data-[variant=transparent-white]:*:[svg]:!text-dark-text-secondary",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
  variant?: "default" | "destructive" | "secondary" | "white" | "transparent-white";
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground dark:focus:bg-shark-700 dark:focus:text-dark-text-primary data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=secondary]:text-secondary-foreground data-[variant=secondary]:focus:bg-secondary data-[variant=secondary]:focus:text-secondary-foreground dark:data-[variant=secondary]:focus:bg-secondary/90 relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-[variant=white]:text-[#1e293b] data-[variant=white]:focus:bg-[#f0f0f0] data-[variant=white]:focus:text-[#0e315d]",
        "dark:data-[variant=white]:text-dark-text-primary dark:data-[variant=white]:focus:bg-shark-800 dark:data-[variant=white]:focus:text-dark-text-accent",
        "data-[variant=transparent-white]:text-[#1e293b] data-[variant=transparent-white]:focus:bg-white/40 data-[variant=transparent-white]:focus:text-[#0e315d]",
        "dark:data-[variant=transparent-white]:text-dark-text-primary dark:data-[variant=transparent-white]:focus:bg-shark-800/40 dark:data-[variant=transparent-white]:focus:text-dark-text-accent",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4 dark:text-dark-text-accent" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & {
  variant?: "default" | "destructive" | "secondary" | "white" | "transparent-white";
}) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground dark:focus:bg-shark-700 dark:focus:text-dark-text-primary data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=secondary]:text-secondary-foreground data-[variant=secondary]:focus:bg-secondary data-[variant=secondary]:focus:text-secondary-foreground dark:data-[variant=secondary]:focus:bg-secondary/90 relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-[variant=white]:text-[#1e293b] data-[variant=white]:focus:bg-[#f0f0f0] data-[variant=white]:focus:text-[#0e315d]",
        "dark:data-[variant=white]:text-dark-text-primary dark:data-[variant=white]:focus:bg-shark-800 dark:data-[variant=white]:focus:text-dark-text-accent",
        "data-[variant=transparent-white]:text-[#1e293b] data-[variant=transparent-white]:focus:bg-white/40 data-[variant=transparent-white]:focus:text-[#0e315d]",
        "dark:data-[variant=transparent-white]:text-dark-text-primary dark:data-[variant=transparent-white]:focus:bg-shark-800/40 dark:data-[variant=transparent-white]:focus:text-dark-text-accent",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current dark:text-dark-text-accent" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8 dark:text-dark-text-secondary",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px dark:bg-shark-700", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest dark:text-dark-text-tertiary",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
  variant?: "default" | "destructive" | "secondary" | "white" | "transparent-white";
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground dark:focus:bg-shark-700 dark:focus:text-dark-text-primary data-[state=open]:bg-accent data-[state=open]:text-accent-foreground dark:data-[state=open]:bg-shark-700 dark:data-[state=open]:text-dark-text-primary data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=secondary]:text-secondary-foreground data-[variant=secondary]:focus:bg-secondary data-[variant=secondary]:focus:text-secondary-foreground dark:data-[variant=secondary]:focus:bg-secondary/90 flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
        "data-[variant=white]:text-[#1e293b] data-[variant=white]:focus:bg-[#f0f0f0] data-[variant=white]:data-[state=open]:bg-[#f0f0f0] data-[variant=white]:focus:text-[#0e315d] data-[variant=white]:data-[state=open]:text-[#0e315d]",
        "dark:data-[variant=white]:text-dark-text-primary dark:data-[variant=white]:focus:bg-shark-800 dark:data-[variant=white]:data-[state=open]:bg-shark-800 dark:data-[variant=white]:focus:text-dark-text-accent dark:data-[variant=white]:data-[state=open]:text-dark-text-accent",
        "data-[variant=transparent-white]:text-[#1e293b] data-[variant=transparent-white]:focus:bg-white/40 data-[variant=transparent-white]:data-[state=open]:bg-white/40 data-[variant=transparent-white]:focus:text-[#0e315d] data-[variant=transparent-white]:data-[state=open]:text-[#0e315d]",
        "dark:data-[variant=transparent-white]:text-dark-text-primary dark:data-[variant=transparent-white]:focus:bg-shark-800/40 dark:data-[variant=transparent-white]:data-[state=open]:bg-shark-800/40 dark:data-[variant=transparent-white]:focus:text-dark-text-accent dark:data-[variant=transparent-white]:data-[state=open]:text-dark-text-accent",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4 dark:text-dark-text-secondary" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent> & {
  variant?: "default" | "secondary" | "white" | "transparent-white";
}) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        variant === "default" &&
          "bg-popover text-popover-foreground dark:bg-shark-900 dark:text-dark-text-primary dark:border-shark-700",
        variant === "secondary" &&
          "bg-secondary text-secondary-foreground dark:bg-secondary dark:text-secondary-foreground dark:border-shark-700",
        variant === "white" &&
          "bg-[#f5f5f5] text-[#1e293b] border-[#e3e3e3] dark:bg-shark-800 dark:text-dark-text-primary dark:border-shark-700",
        variant === "transparent-white" &&
          "bg-white/80 backdrop-blur-sm text-[#1e293b] border-[#efefef] dark:bg-shark-900/80 dark:backdrop-blur-sm dark:text-dark-text-primary dark:border-shark-800",
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};