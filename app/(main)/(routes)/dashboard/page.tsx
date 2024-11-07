'use client';

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { HabitModal } from "@/components/modals/habit-modal";
import { EditHabitModal } from "@/components/modals/edit-habit-modal"; 
import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

const Dashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const displayedMonth = currentDate.format("YYYY-MM");

  const updateHabit = useMutation(api.habits.updateHabit);
  const deleteHabit = useMutation(api.habits.deleteHabit);
  const createHabit = useMutation(api.habits.createHabits);
  const toggleCompletion = useMutation(api.habits.toggleCompletedDateForHabit);
  const habits = useQuery(api.habits.getHabits, { month: displayedMonth });

  const [habitCompletionStatus, setHabitCompletionStatus] = useState<Record<string, Record<number, boolean>>>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<{ id: string; title: string; goal: number } | null>(null);

  const monthName = currentDate.format("MMMM");
  const totalDaysInMonth = currentDate.daysInMonth();
  const todayDate = dayjs().date();
  const isCurrentMonth = dayjs().isSame(currentDate, 'month');

  const rowColors = ["#fbeec8", "#b6d8c6", "#c4d2f1", "#d3c9e3"];

  useEffect(() => {
    if (habits) {
      const initialStatus = habits.reduce((acc, habit) => {
        acc[habit._id] = habit.completedDates.reduce((map, date) => {
          const completedDay = dayjs(date);
          if (completedDay.month() === currentDate.month() && completedDay.year() === currentDate.year()) {
            map[completedDay.date()] = true;
          }
          return map;
        }, {} as Record<number, boolean>);
        return acc;
      }, {} as Record<string, Record<number, boolean>>);

      setHabitCompletionStatus(initialStatus);
    }
  }, [habits, currentDate]);

  const toggleHabitCompletion = async (habitId: string, day: number) => {
    const date = currentDate.date(day).format("YYYY-MM-DD");
    const isCompleted = habitCompletionStatus[habitId]?.[day];
  
    setHabitCompletionStatus((prev) => ({
      ...prev,
      [habitId]: { ...prev[habitId], [day]: !isCompleted },
    }));
  
    toast.promise(toggleCompletion({ habitId: habitId as Id<"habits">, date, add: !isCompleted }), {
      loading: "Updating habit...",
      success: isCompleted ? "Habit marked as incomplete!" : "Habit marked as completed!",
      error: "Failed to update habit",
    });
  };
  

  const changeDisplayedMonth = (direction: number) => setCurrentDate((prev) => prev.add(direction, "month"));

  const generateDaysArray = () => {
    const startDayIndex = currentDate.startOf("month").day();
    return Array.from({ length: 31 }, (_, index) => (index < totalDaysInMonth ? ["S", "M", "T", "W", "T", "F", "S"][(startDayIndex + index) % 7] : null));
  };

  const openEditModal = (habit: { _id: string; title: string; goal: number }) => {
    setSelectedHabit({ id: habit._id, title: habit.title, goal: habit.goal });
    setIsEditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedHabit(null);
  };

  const handleCreateHabit = async (title: string, goal: number) => {
    toast.promise(createHabit({ title, goal, month: displayedMonth }), {
      loading: "Creating habit...",
      success: "Habit created!",
      error: "Failed to create habit",
    });
  };

  const handleUpdateHabit = async (id: string, title: string, goal: number) => {
    await toast.promise(updateHabit({ habitId: id as Id<"habits">, title, goal }), {
      loading: "Updating habit...",
      success: "Habit updated!",
      error: "Failed to update habit",
    });
    setIsEditModalOpen(false);
    setSelectedHabit(null);
  };
  
  const handleDeleteHabit = async (id: string) => {
    await toast.promise(deleteHabit({ habitId: id as Id<"habits"> }), {
      loading: "Deleting habit...",
      success: "Habit deleted!",
      error: "Failed to delete habit",
    });
    setIsEditModalOpen(false);
    setSelectedHabit(null);
  };
  

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center">
        <button onClick={() => changeDisplayedMonth(-1)}><ChevronLeft /></button>
        <h3 className="text-xl mx-4">{monthName} {currentDate.year()}</h3>
        <button onClick={() => changeDisplayedMonth(1)}><ChevronRight /></button>
      </div>

      <div className="habit-tracker-grid">
        <div className="header-day-row">
          <div></div>
          {generateDaysArray().map((dayName, index) => (
            <div key={index} className={`header-day ${isCurrentMonth && index === todayDate - 1 ? "highlight-header" : ""}`}>
              {dayName || ""}
            </div>
          ))}
          <div></div>
          <div></div>
        </div>

        <div className="header-row">
          <div className="text-blue-700">Habits</div>
          {[...Array(31)].map((_, day) => (
            <div key={day + 1} className={`header-number ${isCurrentMonth && day + 1 === todayDate ? "highlight-header" : ""}`}>
              {day + 1 <= totalDaysInMonth ? day + 1 : ""}
            </div>
          ))}
          <div className="text-blue-700">Goal</div>
          <div className="text-blue-700">Done</div>
        </div>

        {habits?.map((habit, habitIndex) => (
  <div
    key={habit._id}
    className={`habit-row ${habitIndex === habits.length - 1 ? "bottom-border" : ""}`}
    style={{ backgroundColor: rowColors[habitIndex % rowColors.length] }}
  >
    <div
      className="habit-name"
      onClick={() => openEditModal(habit)}
    >
      {habit.title}
    </div>
    {[...Array(31)].map((_, day) => {
      const isToday = isCurrentMonth && day + 1 === todayDate;
      const isLastRow = habitIndex === habits.length - 1;

      return (
        <div
          key={day + 1}
          onClick={() => {
            if (day + 1 <= totalDaysInMonth) {
              toggleHabitCompletion(habit._id, day + 1);
            }
          }}
          className={`habit-cell ${habitCompletionStatus[habit._id]?.[day + 1] ? "completed" : ""} ${isToday ? "highlight" : ""} ${isToday && isLastRow ? "bottom-border" : ""}`}
          style={{ backgroundColor: habitCompletionStatus[habit._id]?.[day + 1] ? rowColors[habitIndex % rowColors.length] : '' }}
        >
          {day + 1 <= totalDaysInMonth && habitCompletionStatus[habit._id]?.[day + 1] && "✔"}
        </div>
      );
    })}
    <div className="goal-cell">{habit.goal || "N/A"}</div>
    <div className="achieved-cell" style={{ backgroundColor: Object.values(habitCompletionStatus[habit._id] || {}).filter(Boolean).length < habit.goal ? '#fdfc47' : '#05db94' }}>
      {Object.values(habitCompletionStatus[habit._id] || {}).filter(Boolean).length}
    </div>
  </div>
))}
      </div>

      <HabitModal onSubmit={handleCreateHabit} />

      {selectedHabit && (
        <EditHabitModal
          open={isEditModalOpen}
          onClose={closeEditModal}
          habitId={selectedHabit.id}
          initialTitle={selectedHabit.title}
          initialGoal={selectedHabit.goal}
          onUpdate={handleUpdateHabit}
          onDelete={handleDeleteHabit}
        />
      )}
    </div>
  );
};

export default Dashboard;
