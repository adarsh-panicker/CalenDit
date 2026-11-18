import React from 'react';
import { RotateCw, FlipHorizontal, X } from 'lucide-react';
import { PIECES } from '../constants/pieces';
import type { SelectedPieceState } from '../types/game';
import { PieceThumbnail } from './PieceThumbnail';

interface PieceTrayProps {
  placedPieceIds: Set<string>;
  selectedPiece: SelectedPieceState | null;
  onSelectPiece: (pieceId: string) => void;
  onRotateSelected: () => void;
  onFlipSelected: () => void;
  onDeselect: () => void;
}

export const PieceTray: React.FC<PieceTrayProps> = ({
  placedPieceIds,
  selectedPiece,
  onSelectPiece,
  onRotateSelected,
  onFlipSelected,
  onDeselect,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-3 p-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl backdrop-blur-md">
      {/* Controls Bar for Active Selected Piece */}
      {selectedPiece && (
        <div className="flex items-center justify-between px-3 py-2 bg-zinc-800/90 border border-orange-500/30 rounded-xl shadow-inner animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-orange-400">Selected:</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {PIECES.find((p) => p.id === selectedPiece.pieceId)?.name}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onRotateSelected}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-zinc-100 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors cursor-pointer shadow-sm active:scale-95"
              title="Rotate 90 degrees (Press R)"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotate</span>
              <kbd className="px-1 text-[10px] bg-zinc-800 text-zinc-400 rounded">R</kbd>
            </button>

            <button
              onClick={onFlipSelected}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-zinc-100 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors cursor-pointer shadow-sm active:scale-95"
              title="Flip / Reflect (Press F)"
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span>Flip</span>
              <kbd className="px-1 text-[10px] bg-zinc-800 text-zinc-400 rounded">F</kbd>
            </button>

            <button
              onClick={onDeselect}
              className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer ml-1"
              title="Deselect"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Grid of 8 Pieces in Tray */}
      <div>
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Piece Tray ({PIECES.length - placedPieceIds.size} remaining)
          </span>
          <span className="text-[11px] text-zinc-500">
            Click to select • Tap board to place
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {PIECES.map((piece) => {
            const isPlaced = placedPieceIds.has(piece.id);
            const isSelected = selectedPiece?.pieceId === piece.id;
            const matrixToRender = isSelected ? selectedPiece.matrix : piece.matrix;

            return (
              <PieceThumbnail
                key={piece.id}
                piece={piece}
                matrix={matrixToRender}
                isSelected={isSelected}
                isPlaced={isPlaced}
                onClick={() => onSelectPiece(piece.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
