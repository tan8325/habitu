import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  habits: defineTable({
    title: v.string(),
    userId: v.string(),
    goal: v.number(),
    completedDates: v.optional(v.array(v.string())), // Make completedDates optional
    createdMonth: v.string(),
  }).index("by_user", ["userId"]),
});
