import React from 'react';

export default function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className={`bg-white p-5 rounded-2xl border-l-4 ${color} shadow-sm flex flex-col justify-between h-28 hover:shadow-md transition-shadow`}>
      <div className="flex items-center gap-2 text-gray-400">
        <Icon size={16} />
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-2xl font-black font-mono text-[#111827]">{value}</span>
    </div>
  );
}