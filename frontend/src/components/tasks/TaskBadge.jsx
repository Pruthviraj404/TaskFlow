import React from 'react';

export default function TaskBadge({ category, darkMode }) {
  const styles = {
    work: darkMode
      ? 'bg-blue-900/50 text-blue-300'
      : 'bg-blue-50 text-blue-600',
    study: darkMode
      ? 'bg-emerald-900/50 text-emerald-300'
      : 'bg-emerald-50 text-emerald-600',
    personal: darkMode
      ? 'bg-purple-900/50 text-purple-300'
      : 'bg-purple-50 text-purple-600',
  };

  const key = category?.toLowerCase();

  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
      styles[key] || (darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500')
    }`}>
      {category}
    </span>
  );
}