import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BsChevronDown, BsFillInfoCircleFill } from "react-icons/bs";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import { useConceAI } from "@/providers/ConceAIProvider";
import AppNavModelsDropdownSkeleton from "@/components/Common/Skeletons/AppNavModelsDropdownSkeleton";

export default function AppNavModelsDropdown() {
  const { models: modelsContext } = useConceAI();
  const { models, setSelectedModel, selectedModel, isLoading } = modelsContext;

  if (isLoading) {
    return <AppNavModelsDropdownSkeleton />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-none group shadow-none">
          {selectedModel ? selectedModel.displayName : "Modelos"}
          <BsChevronDown className="text-dark-text-accent group-hover:text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white">
        <DropdownMenuLabel className="flex items-center justify-between">
          Models
          <Link href="/app/models">
            <BsFillInfoCircleFill />
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => setSelectedModel(model)}
            className="flex items-center justify-between gap-3 group"
          >
            <div className="flex flex-col items-start text-left">
              <span className="text-dark-text-accent font-semibold">
                {model.displayName}
              </span>
              <span className="line-clamp-2 text-xs text-dark-text-primary">
                {model.description && model.description}
              </span>
            </div>
            {selectedModel && model.id === selectedModel.id && (
              <FaCheckCircle className="text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
