import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { ConceAIDropdownProps } from "@/types/@conce-ai";

export default function ConceAIDropdown({
  variant,
  items,
  button,
}: ConceAIDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{button}</DropdownMenuTrigger>

      <DropdownMenuContent
        className="mr-4 w-64 mt-1"
        variant={variant}
        align="end"
      >
        <DropdownMenuGroup>
          {items.map((item, index) =>
            item.type === "danger" ? (
              <DropdownMenuItem
                variant="white"
                key={index}
                onClick={item.action}
                className="cursor-pointer"
              >
                <item.icon className="mr-2 h-4 w-4 text-red-500 fill-red-500" />
                <span className="text-red-500">{item.text}</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                key={index}
                variant={variant}
                onClick={item.action}
                className="cursor-pointer"
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.text}</span>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
