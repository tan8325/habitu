import { createHabit } from "../_components/createHabit";

describe("createHabit", () => {
  const mockMutation = jest.fn();

  afterEach(() => {
    jest.clearAllMocks(); // Clear the mock function after each test to avoid interference
  });

  test("successfully creates a habit with valid inputs", async () => {
    await createHabit(mockMutation, "Exercise", 5, "2024-11");
    expect(mockMutation).toHaveBeenCalledWith({
      title: "Exercise",
      goal: 5,
      month: "2024-11",
    });
  });

  test("throws an error when habit name is missing", async () => {
    await expect(createHabit(mockMutation, "", 5, "2024-11")).rejects.toThrow(
      "Habit name must be provided"
    );
  });

  test("throws an error when habit goal is invalid", async () => {
    await expect(createHabit(mockMutation, "Exercise", -1, "2024-11")).rejects.toThrow(
      "Habit goal must be a positive number"
    );
  });

  test("throws an error when habit goal is empty", async () => {
    await expect(createHabit(mockMutation, "Exercise", undefined, "2024-11")).rejects.toThrow(
      "Habit goal must be a positive number"
    );
  });

  // New edge case: habit goal is a very large number
  test("handles very large numbers for habit goal", async () => {
    const largeGoal = 1_000_000;
    await createHabit(mockMutation, "Exercise", largeGoal, "2024-11");
    expect(mockMutation).toHaveBeenCalledWith({
      title: "Exercise",
      goal: largeGoal,
      month: "2024-11",
    });
  });

  // New edge case: habit title contains special characters
  test("handles special characters in habit name", async () => {
    const specialCharacterTitle = "Exerci$e & Medit@te!";
    await createHabit(mockMutation, specialCharacterTitle, 10, "2024-11");
    expect(mockMutation).toHaveBeenCalledWith({
      title: specialCharacterTitle,
      goal: 10,
      month: "2024-11",
    });
  });
});
