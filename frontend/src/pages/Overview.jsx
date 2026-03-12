import React from "react";
import CategoryCard from "../components/tasks/CategoryCard";

export default function Overview({ tasks = [], onToggle }) {

  const categories = ["Work", "Personal", "Study"];

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Categories View</h1>
        <p className="text-gray-500 text-sm">
          Review your progress across different areas.
        </p>
      </div>

      <div className="space-y-4">
        {categories.map((category) => {

          const categoryTasks = tasks.filter(
            (task) =>
              task?.category &&
              task.category.toLowerCase() === category.toLowerCase()
          );

          const totalTasks = categoryTasks.length;

          const completedTasks = categoryTasks.filter(
            (task) => task.is_done === 1 || task.is_done === true
          ).length;

          return (
            <CategoryCard
              key={category}
              category={category}
              total={totalTasks}
              completed={completedTasks}
              tasks={categoryTasks}
              onToggle={onToggle}
            />
          );
        })}
      </div>

    </div>
  );
}
