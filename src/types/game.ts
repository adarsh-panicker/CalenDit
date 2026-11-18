export type CellType = 'month' | 'day' | 'blocked';

export interface BoardCell {
  row: number;
  col: number;
  type: CellType;
  label: string; // e.g., 'JAN', '18', ''
  monthIndex?: number; // 0-11 for months
  dayNumber?: number; // 1-31 for days
}

export type Matrix = number[][]; // 1 = filled, 0 = empty

export interface PieceDef {
  id: string;
  name: string;
  color: string;
  accentColor: string;
  borderColor: string;
  matrix: Matrix; // Base orientation
  defaultRotations?: number; // How many unique rotations
}

export interface PlacedPiece {
  pieceId: string;
  matrix: Matrix;
  row: number; // Top-left anchor row on board
  col: number; // Top-left anchor col on board
  rotation: number; // 0, 90, 180, 270
  flipped: boolean;
}

export interface SelectedPieceState {
  pieceId: string;
  matrix: Matrix;
  rotation: number;
  flipped: boolean;
}

export interface PuzzleDate {
  month: number; // 0-11 (0 = JAN, 11 = DEC)
  day: number; // 1-31
}

export interface GameStats {
  completedDates: string[]; // ['2026-11-18', ...]
  streak: number;
  lastPlayedDate: string;
  bestTimeSeconds: number | null;
  totalGamesPlayed: number;
}
