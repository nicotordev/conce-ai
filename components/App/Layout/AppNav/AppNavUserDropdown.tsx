import UserProfilePic from "@/components/Common/UserProfilePic";
import { Button } from "@/components/ui/button";
import { AppNavUserDropdownProps } from "@/types/common";

export default function AppNavUserDropdown({ session }: AppNavUserDropdownProps) {
  return (
    <Button variant={"outline"} className="border-none">
      <UserProfilePic size={"sm"} session={session} />
    </Button>
  );
}
