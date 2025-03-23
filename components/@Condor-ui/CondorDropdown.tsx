import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { CondorDropdownProps } from "@/types/@condor-ui";

export default function CondorDropdown({
  variant,
  items,
  button,
}: CondorDropdownProps) {
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
              <DropdownMenuItem variant="white" key={index} onClick={item.action}>
                <item.icon className="mr-2 h-4 w-4 text-red-500 fill-red-500" />
                <span className="text-red-500">{item.text}</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem key={index} variant={variant} onClick={item.action}>
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
