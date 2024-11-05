import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface HabitModalProps {
  onSubmit: (title: string, goal: number) => void;
}

export const HabitModal = ({ onSubmit }: HabitModalProps) => {
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState<number | "">("");

  const handleSubmit = (): void => {
    if (title && typeof goal === "number" && goal > 0) {
      onSubmit(title, goal);
      setTitle("");
      setGoal("");
    }
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
        <div className="grid gap-4">
          <div>
            <Label htmlFor="habit-title">Habit Title</Label>
            <Input
              id="habit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your habit title"
            />
          </div>
          <div>
            <Label htmlFor="habit-goal">Habit Goal</Label>
            <Input
              id="habit-goal"
              type="number"
              min="1"
              value={goal === "" ? "" : goal}
              onChange={(e) => setGoal(e.target.value ? Math.max(1, parseInt(e.target.value)) : "")}
              placeholder="Enter your habit goal"
            />
          </div>
          <Button
            onClick={handleSubmit}
            type="button"
            size="sm"
            className="px-3 mt-4"
            disabled={!title || (typeof goal === "number" && goal <= 0)}
          >
            <span className="sr-only">Submit</span>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};