"use client";
import { Button } from "@/components/ui/button";
import { AppNavProps } from "@/types/layout";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { TbMessageCircle } from "react-icons/tb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsChevronDown, BsFillInfoCircleFill } from "react-icons/bs";
import { useState } from "react";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
export default function AppNav({ models }: AppNavProps) {
  const [selectedModel, setSelectedModel] = useState(() => {
    if (models.length > 0) {
      return models[0];
    }
    return {
      displayName: "Select a model",
      description: "",
    };
  });
  return (
    <header>
      <nav className="p-3">
        <div className="flex items-center justify-between">
          <ul className="flex items-center gap-4 text-2xl text-dark-text-accent">
            <li>
              <MdOutlineSpaceDashboard />
            </li>
            <li>
              <TbMessageCircle />
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-none group">
                    {selectedModel.displayName}
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
                      {model.id === selectedModel.id && (
                        <FaCheckCircle className="text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
          <ul>
            <li>
              <div className="flex items-center justify-center gap-4">
                <Button variant={"destructive"}>Compartir</Button>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
