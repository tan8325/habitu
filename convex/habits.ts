import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getHabits = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error ("Not authenticated");
    }
    const userId = identity.subject;
    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) =>
        q
          .eq("userId", userId)
      )
      .order("desc")
      .collect();

    return habits;
  }
});

export const createHabits = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
  
    if (!identity) {
      throw new Error ("Not authenticated");
    }

    const userId = identity.subject;

    const habit = await ctx.db.insert("habits", {
      title: args.title,
      userId,
    });
    return habit;
  }
});