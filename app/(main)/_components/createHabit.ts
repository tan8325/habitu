export async function createHabit(
  mutation: (input: { title: string; goal: number; month: string }) => Promise<void>,
  title: string,
  goal: number | undefined,
  month: string
): Promise<void> {
  if (!title || title.trim() === "") {
    throw new Error("Habit name must be provided");
  }
  if (typeof goal !== "number" || goal <= 0) {
    throw new Error("Habit goal must be a positive number");
  }

  await mutation({
    title: title.trim(),
    goal,
    month,
  });
}
