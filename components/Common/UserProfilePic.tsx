import { UserProfilePicProps } from "@/types/common";
import clsx from "clsx";
import Image from "next/image";

export default function UserProfilePic({
  size = "md",
  className,
  session,
}: UserProfilePicProps) {
  if (session?.user.image) {
    return (
      <Image
        src={session.user.image}
        alt={session.user.name || ""}
        width={size === "sm" ? 32 : size === "md" ? 48 : 64}
        height={size === "sm" ? 32 : size === "md" ? 48 : 64}
        className={className}
      />
    );
  }

  if (session?.user.name) {
    const firstLetterOfName = session.user.name.charAt(0).toUpperCase();
    return (
      <div>
        <div
          className={clsx(
            "flex items-center justify-center bg-primary text-white rounded-full shadow-md border border-solid border-gray-300",
            {
              "w-8 h-8": size === "sm",
              "w-12 h-12": size === "md",
              "w-16 h-16": size === "lg",
            }
          )}
        >
          {firstLetterOfName}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className={clsx(
          "flex items-center justify-center bg-primary text-white rounded-full shadow-md border border-solid border-gray-300",
          {
            "w-8 h-8": size === "sm",
            "w-12 h-12": size === "md",
            "w-16 h-16": size === "lg",
          }
        )}
      >
        {" "}
        <span className="text-xs">?</span>
      </div>
    </div>
  );
}
