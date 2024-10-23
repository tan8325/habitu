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
    className = "group min-h-[27px] text-md py-3 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium pl-2"
  >
    <Icon className="shrink-1 h-[18px] mr-2 text-muted-foreground"/>
    <span>
      {label}
    </span>
  </div>
  )
}