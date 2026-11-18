import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Share2, Check, Flame, Clock, RefreshCw, Calendar } from 'lucide-react';
import { MONTH_NAMES } from '../constants/board';
import type { PuzzleDate } from '../types/game';
import { formatTime, generateShareText } from '../utils/calendar';

interface WinModalProps {
  currentDate: PuzzleDate;
  isToday: boolean;
  timeSeconds: number;
  moveCount: number;
  hintsUsed: number;
  streak: number;
  onOpenArchive: () => void;
  onClose: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  currentDate,
  isToday,
  timeSeconds,
  moveCount,
  hintsUsed,
  streak,
  onOpenArchive,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const monthName = MONTH_NAMES[currentDate.month];

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF4500', '#FFB000', '#0079D3', '#46D160', '#A05CF6'],
      });
    } catch {
      // ignore in environments without canvas
    }
  }, []);

  const handleCopyShare = async () => {
    const text = generateShareText(currentDate, timeSeconds, moveCount, hintsUsed, streak);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Trophy icon with glow */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/30 mb-4 animate-bounce">
          <Trophy className="w-9 h-9 text-white" />
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight">
          {isToday ? "Today's Puzzle Solved!" : 'Puzzle Solved!'}
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          {monthName} {currentDate.day} revealed successfully.
        </p>

        {/* Telemetry stats card */}
        <div className="grid grid-cols-3 gap-3 w-full my-5 p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-2xl">
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase flex items-center gap-1">
              <Clock className="w-3 h-3 text-orange-400" /> Time
            </span>
            <span className="text-lg font-black text-white font-mono mt-0.5">
              {formatTime(timeSeconds)}
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-zinc-800">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-blue-400" /> Moves
            </span>
            <span className="text-lg font-black text-white font-mono mt-0.5">
              {moveCount}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" /> Streak
            </span>
            <span className="text-lg font-black text-orange-400 font-mono mt-0.5">
              {streak}
            </span>
          </div>
        </div>

        {/* Share Button for Reddit Comments */}
        <button
          onClick={handleCopyShare}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/30 transition-all cursor-pointer active:scale-98"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Copied Reddit Comment to Clipboard!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Share Score in Comments</span>
            </>
          )}
        </button>

        {/* Action options */}
        <div className="flex items-center gap-2 w-full mt-3">
          <button
            onClick={onOpenArchive}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-700 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-orange-400" />
            <span>Play Another Date</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl border border-zinc-700 transition-colors cursor-pointer"
          >
            Review Board
          </button>
        </div>
      </div>
    </div>
  );
};
