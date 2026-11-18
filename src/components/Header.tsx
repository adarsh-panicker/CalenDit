import React from 'react';
import { Flame, HelpCircle, Calendar, Volume2, VolumeX, RotateCcw, Lightbulb } from 'lucide-react';
import { MONTH_NAMES } from '../constants/board';
import type { PuzzleDate } from '../types/game';
import { formatTime } from '../utils/calendar';

interface HeaderProps {
  currentDate: PuzzleDate;
  isToday: boolean;
  streak: number;
  timerSeconds: number;
  moveCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHowToPlay: () => void;
  onOpenArchive: () => void;
  onResetBoard: () => void;
  onRequestHint: () => void;
  hintsUsed: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  isToday,
  streak,
  timerSeconds,
  moveCount,
  soundEnabled,
  onToggleSound,
  onOpenHowToPlay,
  onOpenArchive,
  onResetBoard,
  onRequestHint,
  hintsUsed,
}) => {
  const monthName = MONTH_NAMES[currentDate.month];

  return (
    <header className="w-full max-w-2xl mx-auto flex flex-col gap-2 p-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl backdrop-blur-md">
      {/* Top Bar: Title & Primary Tools */}
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center font-black text-white text-lg shadow-md shadow-orange-500/30">
            C
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">Calen<span className="text-orange-500">Dit</span></span>
              {isToday && (
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-md">
                  Daily
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 leading-none">The Daily Date Polyomino</p>
          </div>
        </div>

        {/* Date Display & Archive Switcher */}
        <button
          onClick={onOpenArchive}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/80 rounded-xl transition-all cursor-pointer text-xs font-semibold text-zinc-200"
          title="Change Date / Free Play"
        >
          <Calendar className="w-3.5 h-3.5 text-orange-400" />
          <span>{monthName} {currentDate.day}</span>
        </button>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleSound}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>
          <button
            onClick={onOpenHowToPlay}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Secondary Bar: Live Game Telemetry */}
      <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-xs">
        {/* Streak */}
        <div className="flex items-center gap-1 text-zinc-300 font-medium">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20" />
          <span>Streak: <strong className="text-white">{streak}</strong></span>
        </div>

        {/* Timer & Moves */}
        <div className="flex items-center gap-3 text-zinc-400 font-mono">
          <span>⏱️ <strong className="text-zinc-200">{formatTime(timerSeconds)}</strong></span>
          <span>Moves: <strong className="text-zinc-200">{moveCount}</strong></span>
        </div>

        {/* Reset & Hint */}
        <div className="flex items-center gap-1">
          <button
            onClick={onRequestHint}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
            title="Place one piece as a hint"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Hint {hintsUsed > 0 && `(${hintsUsed})`}</span>
          </button>
          <button
            onClick={onResetBoard}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            title="Reset Board"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
