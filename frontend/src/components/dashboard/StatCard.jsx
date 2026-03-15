import React from 'react';

export default function StatCard({ label, value, icon: Icon, color, darkMode }) {
  return (
    <div
      className={`p-5 rounded-2xl border-l-4 ${color} shadow-sm flex flex-col justify-between h-28 hover:shadow-md transition-shadow
        ${darkMode ? 'bg-gray-800 text-gray-200 border-gray-600' : 'bg-white text-gray-900 border-gray-200'}
      `}
    >
      <div className="flex items-center gap-2 text-gray-400">
        <Icon size={16} className={darkMode ? 'text-gray-300' : 'text-gray-400'} />
        <span className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-300' : 'text-gray-400'}`}>
          {label}
        </span>
      </div>
      <span className={`text-2xl font-black font-mono ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
        {value}
      </span>
    </div>
  );
}