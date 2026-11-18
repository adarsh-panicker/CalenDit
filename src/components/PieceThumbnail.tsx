import React from 'react';
import type { Matrix, PieceDef } from '../types/game';

interface PieceThumbnailProps {
  piece: PieceDef;
  matrix: Matrix;
  isSelected?: boolean;
  isPlaced?: boolean;
  cellSize?: number;
  onClick?: () => void;
}

export const PieceThumbnail: React.FC<PieceThumbnailProps> = ({
  piece,
  matrix,
  isSelected = false,
  isPlaced = false,
  cellSize = 14,
  onClick,
}) => {
  const rows = matrix.length;
  const cols = matrix[0].length;

  return (
    <button
      onClick={onClick}
      disabled={isPlaced}
      className={`relative p-2 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center select-none ${
        isPlaced
          ? 'opacity-25 grayscale cursor-not-allowed'
          : isSelected
          ? 'bg-zinc-800 ring-2 ring-orange-500 scale-105 shadow-lg shadow-orange-500/20'
          : 'bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700'
      }`}
      title={isPlaced ? `${piece.name} (Placed)` : `Select ${piece.name}`}
    >
      <div
        className="grid gap-[2px]"
        style={{
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        }}
      >
        {matrix.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: val === 1 ? piece.color : 'transparent',
                borderColor: val === 1 ? piece.borderColor : 'transparent',
              }}
              className={val === 1 ? 'rounded-[3px] border shadow-sm' : ''}
            />
          ))
        )}
      </div>
    </button>
  );
};
