import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

async function authenticateUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity.subject;
}

export const getHabits = query({
  args: {
    month: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await authenticateUser(ctx);

    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return habits
      .filter((habit) => habit.createdMonth === args.month)
      .map((habit) => ({
        ...habit,
        completedDates: habit.completedDates || [],
      }));
  },
});

export const createHabits = mutation({
  args: {
    title: v.string(),
    goal: v.number(),
    month: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await authenticateUser(ctx);
    
    const habit = await ctx.db.insert("habits", {
      title: args.title,
      userId,
      goal: args.goal,
      completedDates: [],
      createdMonth: args.month,
    });
    return habit;
  },
});

export const toggleCompletedDateForHabit = mutation({
  args: {
    habitId: v.id("habits"),
    date: v.string(),
    add: v.boolean(),
  },
  handler: async (ctx, { habitId, date, add }) => {
    const userId = await authenticateUser(ctx);

    const habit = await ctx.db.get(habitId);
    if (!habit || habit.userId !== userId) {
      throw new Error("Habit not found or unauthorized");
    }

    // Use fallback for completedDates if it's undefined
    const currentCompletedDates = habit.completedDates || [];

    const updatedCompletedDates = add
      ? [...new Set([...currentCompletedDates, date])] // Add date if 'add' is true
      : currentCompletedDates.filter((completedDate) => completedDate !== date); // Remove date if 'add' is false

    await ctx.db.patch(habitId, { completedDates: updatedCompletedDates });

    return date;
  },
});

export const updateHabit = mutation({
  args: {
    habitId: v.id("habits"),
    title: v.string(),
    goal: v.number(),
  },
  handler: async (ctx, { habitId, title, goal }) => {
    const userId = await authenticateUser(ctx);

    const habit = await ctx.db.get(habitId);
    if (!habit || habit.userId !== userId) {
      throw new Error("Habit not found or unauthorized");
    }

    await ctx.db.patch(habitId, { title, goal });

    return habitId;
  },
});

export const deleteHabit = mutation({
  args: {
    habitId: v.id("habits"),
  },
  handler: async (ctx, { habitId }) => {
    const userId = await authenticateUser(ctx);

    const habit = await ctx.db.get(habitId);
    if (!habit || habit.userId !== userId) {
      throw new Error("Habit not found or unauthorized");
    }

    await ctx.db.delete(habitId);
    return habitId;
  },
});
