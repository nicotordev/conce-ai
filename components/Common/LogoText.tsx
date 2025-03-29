import { LogoTextProps } from "@/types/common";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

export default function LogoText({ className }: LogoTextProps) {
  return (
    <Link href="/">
      <h1
        className={twMerge(
          "text-xl !font-semibold !text-white !font-sans tracking-wide",
          className
        )}
      >
        ConceAI
      </h1>
    </Link>
  );
}
