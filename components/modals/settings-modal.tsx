"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Settings } from "lucide-react";

export const SettingsModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button
  variant="ghost"
  className="group min-h-[27px] text-md py-6 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium pl-3"
>
  <Settings className="shrink-1 h-[18px] text-muted-foreground mr-1 " />
  <span className="flex-1 text-left">Settings</span>
</Button>

      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b pb-3">
          <DialogTitle>My Settings</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Appearance</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how HabitU looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
};
