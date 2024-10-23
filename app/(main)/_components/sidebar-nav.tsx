"use client";

import { LucideIcon } from "lucide-react";

interface ItemProps {
  label: string;
  onClick: () => void;
  icon: LucideIcon;
};

export const Item = ({
  label,
  onClick,
  icon: Icon,
}: ItemProps) => {
  return (
  <div
    onClick={onClick}
    role="button"
    className="group min-h-[27px] text-md py-3 pr-3 w-full flex items-center font-medium pl-2 text-muted-foreground hover:bg-primary/5 hover:text-black dark:hover:text-white"

  >
    <Icon className="shrink-1 h-[18px] mr-2 text-muted-foreground"/>
    <span>
      {label}
    </span>
  </div>
  )
}