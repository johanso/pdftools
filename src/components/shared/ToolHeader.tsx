// src/components/shared/ToolHeader.tsx
'use client';

import { ReactNode } from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../ui/tooltip";
import { cn } from "@/lib/utils";

export interface ActionConfig {
  id: string;
  icon: ReactNode;
  tooltip: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

interface ToolHeaderProps {
  title?: string;
  actions: ActionConfig[];
}

export default function ToolHeader({ title, actions = [] }: ToolHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-0 py-2 ps-3 rounded-t-lg border">
      {title && <h3 className="text-sm font-semibold text-gray-700">{title}</h3>}
      
      <div className="flex items-center">
        <TooltipProvider>
          {actions.map((action) => (
            <Tooltip key={action.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={cn(action.className, "hover:bg-transparent")}
                  aria-label={action.tooltip}
                >
                  {action.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{action.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}