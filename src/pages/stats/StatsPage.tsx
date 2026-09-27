import React from 'react';

export const StatsPage: React.FC = () => {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#111111]">Study Analytics</h1>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl px-4 py-4 shadow-sm bg-white">
          <p className="text-xs text-[#888888]">Study Streak</p>
          <p className="text-2xl font-extrabold text-[#F07820]">12 Days</p>
        </div>
        <div className="rounded-2xl px-4 py-4 shadow-sm bg-white">
          <p className="text-xs text-[#888888]">Hours Spent</p>
          <p className="text-2xl font-extrabold text-[#111111]">18.5 hrs</p>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
