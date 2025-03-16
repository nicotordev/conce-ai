import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsChevronDown } from "react-icons/bs";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function AppNavModelsDropdownSkeleton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-none group shadow-none">
          <Skeleton width={80} height={20} />
          <BsChevronDown className="text-dark-text-accent group-hover:text-white ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white">
        <DropdownMenuLabel className="flex items-center justify-between">
          Models
          <Skeleton circle width={16} height={16} />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <DropdownMenuItem
              key={index}
              className="flex items-center justify-between gap-3 group"
            >
              <div className="flex flex-col items-start text-left w-full">
                <Skeleton width={100} height={16} />
                <Skeleton width={180} height={10} />
              </div>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
