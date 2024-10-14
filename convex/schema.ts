import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  habits: defineTable({
    content: v.optional(v.string()),
    icon: v.optional(v.string()),
    isComplete: v.boolean(),
    title: v.string(),
    userId: v.string(),
    streak: v.optional(v.number()),
  }).index("by_user", ["userId"]),
});
