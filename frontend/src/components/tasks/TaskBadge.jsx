import React from 'react';

export default function TaskBadge({ category }) {
  const styles = {
    Work: 'bg-blue-50 text-blue-600',
    Study: 'bg-emerald-50 text-emerald-600',
    Personal: 'bg-purple-50 text-purple-600'
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${styles[category] || 'bg-gray-50'}`}>
      {category}
    </span>
  );
}