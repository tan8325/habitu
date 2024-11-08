import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

async function authenticateUser(ctx: { auth: { getUserIdentity: () => Promise<{ subject: string } | null> } }): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity.subject;
}

export const getCompletedHabits = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Query the habits table to get all habits for the given userId
    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Map _id to id for each habit and filter completed habits
    const completedHabitsCount = habits
      .map(habit => ({
        ...habit,
        id: habit._id,  // Mapping _id to id
      }))
      .filter(habit => habit.isCompleted).length;

    return completedHabitsCount; // Return the count of completed habits
  },
});

// Get habits for a specific month
export const getHabits = query({
  args: { month: v.string() },
  handler: async (ctx, { month }) => {
    const userId = await authenticateUser(ctx);
    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return habits
      .map(habit => ({
        ...habit,
        id: habit._id, // Mapping _id to id
        completedDates: habit.completedDates || [], // Ensure completedDates is an array
      }))
      .filter((habit) => habit.createdMonth === month);
  },
});

// Create a new habit
export const createHabits = mutation({
  args: { title: v.string(), goal: v.number(), month: v.string() },
  handler: async (ctx, { title, goal, month }) => {
    const userId = await authenticateUser(ctx);

    // Validate month format
    if (!/^\d{4}-\d{2}$/.test(month)) {
      throw new Error("Invalid month format. Expected 'YYYY-MM'.");
    }

    // Insert the new habit into the database
    const habitId = await ctx.db.insert("habits", {
      title,
      userId,
      goal,
      completedDates: [],
      createdMonth: month,
      isCompleted: false,
    });

    const newHabit = await ctx.db.get(habitId);
    if (!newHabit) {
      throw new Error("Failed to create habit");
    }

    // Map _id to id for consistency with Habit interface
    return {
      ...newHabit,
      id: newHabit._id,
    };
  },
});

// Toggle completion of a habit on a specific date
export const toggleCompletedDateForHabit = mutation({
  args: { habitId: v.id("habits"), date: v.string(), add: v.boolean() },
  handler: async (ctx, { habitId, date, add }) => {
    const userId = await authenticateUser(ctx);

    // Get the habit to update
    const habit = await ctx.db.get(habitId);
    if (!habit || habit.userId !== userId) {
      throw new Error("Habit not found or unauthorized");
    }

    // Map _id to id for consistency with Habit interface
    const updatedHabit = {
      ...habit,
      id: habit._id, // Mapping _id to id
    };

    // Update the completedDates array based on the action
    const updatedCompletedDates = add
      ? [...new Set([...updatedHabit.completedDates, date])]
      : updatedHabit.completedDates.filter((completedDate) => completedDate !== date);

    // Check if the habit's goal has been reached
    const isGoalReached = updatedCompletedDates.length >= updatedHabit.goal;

    // Update the habit in the database, marking it as completed if the goal is reached
    await ctx.db.patch(habitId, {
      completedDates: updatedCompletedDates,
      isCompleted: isGoalReached,
    });

    return date;
  },
});

// Update a habit's details (title, goal)
export const updateHabit = mutation({
  args: { habitId: v.id("habits"), title: v.string(), goal: v.number() },
  handler: async (ctx, { habitId, title, goal }) => {
    const userId = await authenticateUser(ctx);

    // Get the habit to update
    const habit = await ctx.db.get(habitId);
    if (!habit || habit.userId !== userId) {
      throw new Error("Habit not found or unauthorized");
    }

    // Update the habit in the database
    await ctx.db.patch(habitId, { title, goal });

    return habitId;
  },
});

// Delete a habit
export const deleteHabit = mutation({
  args: { habitId: v.id("habits") },
  handler: async (ctx, { habitId }) => {
    const userId = await authenticateUser(ctx);

    // Get the habit to delete
    const habit = await ctx.db.get(habitId);
    if (!habit || habit.userId !== userId) {
      throw new Error("Habit not found or unauthorized");
    }

    // Delete the habit from the database
    await ctx.db.delete(habitId);
    return habitId;
  },
});
