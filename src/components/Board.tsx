import React, { useState } from 'react';
import { BOARD_COLS, BOARD_LAYOUT, BOARD_ROWS } from '../constants/board';
import { PIECE_MAP } from '../constants/pieces';
import type { PlacedPiece, PuzzleDate, SelectedPieceState } from '../types/game';
import { getFilledCoords } from '../utils/matrix';

interface BoardProps {
  currentDate: PuzzleDate;
  placedPieces: PlacedPiece[];
  selectedPiece: SelectedPieceState | null;
  onPlacePiece: (row: number, col: number) => void;
  onRemovePlacedPiece: (pieceId: string) => void;
}

export const Board: React.FC<BoardProps> = ({
  currentDate,
  placedPieces,
  selectedPiece,
  onPlacePiece,
  onRemovePlacedPiece,
}) => {
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);

  // Map each board cell (row, col) to placed piece info
  const occupiedMap = new Map<string, { pieceId: string; color: string; borderColor: string }>();
  for (const placed of placedPieces) {
    const piece = PIECE_MAP.get(placed.pieceId);
    if (!piece) continue;
    const coords = getFilledCoords(placed.matrix);
    for (const [dr, dc] of coords) {
      const r = placed.row + dr;
      const c = placed.col + dc;
      occupiedMap.set(`${r},${c}`, {
        pieceId: placed.pieceId,
        color: piece.color,
        borderColor: piece.borderColor,
      });
    }
  }

  // Calculate ghost preview coordinates and validity if a piece is selected
  let ghostCoords: [number, number][] = [];
  let isGhostValid = false;

  if (selectedPiece && hoveredCell) {
    const [anchorR, anchorC] = hoveredCell;
    const coords = getFilledCoords(selectedPiece.matrix);
    ghostCoords = coords.map(([dr, dc]) => [anchorR + dr, anchorC + dc]);

    isGhostValid = true;
    for (const [r, c] of ghostCoords) {
      // Out of bounds check
      if (r < 0 || r >= BOARD_ROWS || c < 0 || c >= BOARD_COLS) {
        isGhostValid = false;
        break;
      }
      const cell = BOARD_LAYOUT[r][c];
      // Blocked cell check
      if (cell.type === 'blocked') {
        isGhostValid = false;
        break;
      }
      // Target Month or Day cannot be covered!
      if (cell.type === 'month' && cell.monthIndex === currentDate.month) {
        isGhostValid = false;
        break;
      }
      if (cell.type === 'day' && cell.dayNumber === currentDate.day) {
        isGhostValid = false;
        break;
      }
      // Cannot overlap another placed piece
      if (occupiedMap.has(`${r},${c}`)) {
        isGhostValid = false;
        break;
      }
    }
  }

  const ghostSet = new Set(ghostCoords.map(([r, c]) => `${r},${c}`));

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center select-none">
      <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div
          className="grid gap-1 sm:gap-1.5"
          style={{
            gridTemplateRows: `repeat(${BOARD_ROWS}, minmax(40px, 54px))`,
            gridTemplateColumns: `repeat(${BOARD_COLS}, minmax(40px, 54px))`,
          }}
          onMouseLeave={() => setHoveredCell(null)}
        >
          {BOARD_LAYOUT.map((row, r) =>
            row.map((cell, c) => {
              const cellKey = `${r},${c}`;
              const isBlocked = cell.type === 'blocked';
              const isMonthTarget =
                cell.type === 'month' && cell.monthIndex === currentDate.month;
              const isDayTarget =
                cell.type === 'day' && cell.dayNumber === currentDate.day;
              const isTarget = isMonthTarget || isDayTarget;

              const occupant = occupiedMap.get(cellKey);
              const isGhost = ghostSet.has(cellKey);

              // Click handler
              const handleClick = () => {
                if (isBlocked) return;

                if (occupant) {
                  // Click placed piece to remove it back to tray
                  onRemovePlacedPiece(occupant.pieceId);
                  return;
                }

                if (selectedPiece && isGhostValid) {
                  onPlacePiece(r, c);
                }
              };

              if (isBlocked) {
                return (
                  <div
                    key={cellKey}
                    className="w-full h-full rounded-xl bg-zinc-900/30 border border-zinc-900/50"
                  />
                );
              }

              return (
                <button
                  key={cellKey}
                  type="button"
                  onClick={handleClick}
                  onMouseEnter={() => setHoveredCell([r, c])}
                  style={{
                    backgroundColor: occupant
                      ? occupant.color
                      : isGhost
                      ? isGhostValid
                        ? 'rgba(74, 222, 128, 0.45)'
                        : 'rgba(239, 68, 68, 0.45)'
                      : isTarget
                      ? 'rgba(249, 115, 22, 0.18)'
                      : undefined,
                    borderColor: occupant
                      ? occupant.borderColor
                      : isGhost
                      ? isGhostValid
                        ? '#4ade80'
                        : '#ef4444'
                      : isTarget
                      ? '#f97316'
                      : undefined,
                  }}
                  className={`relative w-full h-full rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-75 cursor-pointer ${
                    occupant
                      ? 'shadow-md border-2 text-white font-extrabold hover:brightness-110 active:scale-95'
                      : isTarget
                      ? 'border-2 shadow-sm text-orange-400 font-black animate-pulse'
                      : 'bg-zinc-900 hover:bg-zinc-800/90 border border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                  title={
                    occupant
                      ? `Placed piece. Click to remove.`
                      : isTarget
                      ? `Target date: Must stay uncovered!`
                      : cell.label
                  }
                >
                  {/* Target date indicator glow */}
                  {isTarget && !occupant && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
                    </span>
                  )}

                  <span className={occupant ? 'drop-shadow text-white/90' : ''}>
                    {cell.label}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
