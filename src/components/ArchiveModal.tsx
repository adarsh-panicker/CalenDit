import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Check } from 'lucide-react';
import { MONTH_NAMES } from '../constants/board';
import type { PuzzleDate } from '../types/game';
import { getTodayDate } from '../utils/calendar';

interface ArchiveModalProps {
  currentDate: PuzzleDate;
  completedDates: string[];
  onSelectDate: (date: PuzzleDate) => void;
  onClose: () => void;
}

export const ArchiveModal: React.FC<ArchiveModalProps> = ({
  currentDate,
  onSelectDate,
  onClose,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.month);
  const [selectedDay, setSelectedDay] = useState<number>(currentDate.day);
  const today = getTodayDate();

  // Max days in selected month (handle leap year 29 for Feb)
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][selectedMonth];

  const handleApply = () => {
    const validDay = Math.min(selectedDay, daysInMonth);
    onSelectDate({ month: selectedMonth, day: validDay });
    onClose();
  };

  const handleSetToday = () => {
    onSelectDate(today);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white">Select Any Date</h3>
            <p className="text-xs text-zinc-400">Play your birthday, anniversary, or practice</p>
          </div>
        </div>

        {/* Quick jump to today */}
        <button
          onClick={handleSetToday}
          className="mb-4 w-full py-2 px-3 bg-zinc-800/80 hover:bg-zinc-700/80 text-orange-400 border border-orange-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Jump to Today's Daily Challenge ({MONTH_NAMES[today.month]} {today.day})</span>
        </button>

        {/* Month Selector */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
            Select Month
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {MONTH_NAMES.map((name, idx) => (
              <button
                key={name}
                onClick={() => setSelectedMonth(idx)}
                className={`py-1.5 px-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedMonth === idx
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Day Selector */}
        <div className="mb-5">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
            Select Day ({MONTH_NAMES[selectedMonth]})
          </span>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedDay === day
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleApply}
          className="w-full flex items-center justify-center gap-2 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Load Puzzle for {MONTH_NAMES[selectedMonth]} {selectedDay}</span>
        </button>
      </div>
    </div>
  );
};
