import React from 'react';
import { X, Calendar, RotateCw, FlipHorizontal, Sparkles } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white">How to Play CalenDit</h3>
            <p className="text-xs text-zinc-400">The daily calendar polyomino puzzle</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-xs text-zinc-300 leading-relaxed">
          <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex gap-3 items-start">
            <Calendar className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-white block mb-0.5">1. The Goal</strong>
              Cover every single square on the board using all 8 pieces, leaving <strong>ONLY today's Month and Day</strong> uncovered!
            </div>
          </div>

          <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex gap-3 items-start">
            <RotateCw className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-white block mb-0.5">2. Controls</strong>
              Click a piece in the tray to select it. Click on the board to place it.
              Use <strong>Rotate (R)</strong> and <strong>Flip (F)</strong> to turn or mirror the piece.
            </div>
          </div>

          <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex gap-3 items-start">
            <FlipHorizontal className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-white block mb-0.5">3. Undo / Remove</strong>
              Made a mistake? Tap any placed piece on the board to pick it back up and return it to your tray.
            </div>
          </div>

          <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex gap-3 items-start">
            <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-white block mb-0.5">4. Daily Streak & Sharing</strong>
              Every single day has at least one mathematical solution! Solve it daily to build your streak and copy your spoiler score card to the Reddit comment thread.
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-md shadow-orange-600/30"
        >
          Got It, Let's Play!
        </button>
      </div>
    </div>
  );
};
