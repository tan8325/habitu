"use client";

import { LayoutList } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { HabitModal } from "@/components/modals/habit-modal";

const Dashboard = () => {
  const { user } = useUser();
  const create = useMutation(api.habits.createHabits);
  const habits = useQuery(api.habits.getHabits);
  
  const handleCreateHabit = (title: string) => {
    const promise = create({ title });
    toast.promise(promise, {
      loading: "Creating habit...",
      success: "Habit created!",
      error: "Failed to create habit",
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      {habits?.map((habit) => (
        <p key={habit._id}>
          {habit.title}
        </p>
      ))}
      <LayoutList />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Habits
      </h2>
      <HabitModal onSubmit={handleCreateHabit} />
    </div>
  );
}

export default Dashboard;
