"use client"

import { LayoutList, PlusCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useUser();
  const create = useMutation(api.habits.create);
  const habits = useQuery(api.habits.get);

  const onCreate = () => {
    const promise = create({ title: "New Habit" });

    toast.promise(promise, {
      loading: "Creating habit...",
      success: "Habit created!",
      error: "Failed to create habit",
    })
  }

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
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a new habit
      </Button>
    </div>
  );
}

export default Dashboard;