import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface EditHabitModalProps {
  open: boolean;
  onClose: () => void;
  habitId: string;
  initialTitle: string;
  initialGoal: number;
  onUpdate: (id: string, title: string, goal: number) => void;
  onDelete: (id: string) => void;
}

export const EditHabitModal = ({
  open,
  onClose,
  habitId,
  initialTitle,
  initialGoal,
  onUpdate,
  onDelete,
}: EditHabitModalProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [goal, setGoal] = useState<number | "">(initialGoal);

  useEffect(() => {
    setTitle(initialTitle);
    setGoal(initialGoal);
  }, [initialTitle, initialGoal]);

  const handleUpdate = () => {
    if (title && typeof goal === "number" && goal > 0) {
      onUpdate(habitId, title, goal);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
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
          <div className="flex justify-between">
            <Button onClick={() => onDelete(habitId)} variant="destructive">
              Delete Habit
            </Button>
            <Button onClick={handleUpdate} disabled={!title || (typeof goal === "number" && goal <= 0)}>
              Update
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};