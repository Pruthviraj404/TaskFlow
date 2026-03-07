import React from 'react';
import CategoryCard from '../components/tasks/CategoryCard';

export default function Overview({ tasks, onToggle }) {
  // These categories should match the ones in your AddTaskModal
  const categories = ['Work', 'Personal', 'Study'];

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Categories View</h1>
        <p className="text-gray-500 text-sm">Review your progress across different areas.</p>
      </div>

      <div className="space-y-4">
        {categories.map(cat => {
          // Filter tasks belonging to this category
          const categoryTasks = tasks.filter(t => t.category?.toLowerCase() === cat.toLowerCase());
          const completedCount = categoryTasks.filter(t => t.is_done === 1).length;

          return (
            <CategoryCard 
              key={cat}
              category={cat}
              total={categoryTasks.length}
              completed={completedCount}
              tasks={categoryTasks}
              onToggle={onToggle}
            />
          );
        })}
      </div>
    </div>
  );
}