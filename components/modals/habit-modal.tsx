import { Plus, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface HabitModalProps {
  onSubmit: (title: string) => void;
}

export const HabitModal = ({ onSubmit }: HabitModalProps) => {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    onSubmit(title);
    setTitle("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          Add Habit
          <PlusCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a Habit</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="habit-title" className="sr-only">
              Habit Title
            </Label>
            <Input
              id="habit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your habit title"
            />
          </div>
          <Button onClick={handleSubmit} type="button" size="sm" className="px-3">
            <span className="sr-only">Submit</span>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
