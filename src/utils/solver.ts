import { BOARD_COLS, BOARD_LAYOUT, BOARD_ROWS } from '../constants/board';
import { PIECES } from '../constants/pieces';
import type { Matrix, PlacedPiece } from '../types/game';
import { getFilledCoords, transformMatrix } from './matrix';

// Cache all pre-computed unique orientations for all pieces
interface PieceOrientation {
  pieceId: string;
  matrix: Matrix;
  rotation: number;
  flipped: boolean;
  coords: [number, number][]; // relative filled cell offsets
  width: number;
  height: number;
}

const ALL_ORIENTATIONS: Record<string, PieceOrientation[]> = {};

// Initialize all unique piece orientations
(function precomputeOrientations() {
  for (const piece of PIECES) {
    const list: PieceOrientation[] = [];
    const seen = new Set<string>();

    for (const flipped of [false, true]) {
      for (const rotation of [0, 90, 180, 270]) {
        const mat = transformMatrix(piece.matrix, rotation, flipped);
        const key = mat.map((row) => row.join('')).join('|');

        if (!seen.has(key)) {
          seen.add(key);
          list.push({
            pieceId: piece.id,
            matrix: mat,
            rotation,
            flipped,
            coords: getFilledCoords(mat),
            height: mat.length,
            width: mat[0].length,
          });
        }
      }
    }
    ALL_ORIENTATIONS[piece.id] = list;
  }
})();

/**
 * Fast backtracking solver to find a valid solution for targetMonth and targetDay
 */
export function solvePuzzle(
  targetMonth: number,
  targetDay: number,
  placedPrefix: PlacedPiece[] = []
): PlacedPiece[] | null {
  // Create 7x7 board state:
  // -1 = blocked or target date cell (must NOT be covered)
  //  0 = empty active cell that MUST be covered
  //  1+ = covered by piece
  const board: number[][] = Array.from({ length: BOARD_ROWS }, () =>
    Array(BOARD_COLS).fill(0)
  );

  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const cell = BOARD_LAYOUT[r][c];
      if (cell.type === 'blocked') {
        board[r][c] = -1;
      } else if (cell.type === 'month' && cell.monthIndex === targetMonth) {
        board[r][c] = -1; // Target month must remain exposed
      } else if (cell.type === 'day' && cell.dayNumber === targetDay) {
        board[r][c] = -1; // Target day must remain exposed
      }
    }
  }

  const solution: PlacedPiece[] = [];
  const usedPieceIds = new Set<string>();

  // Apply any already placed pieces
  for (const p of placedPrefix) {
    const coords = getFilledCoords(p.matrix);
    let valid = true;
    for (const [dr, dc] of coords) {
      const nr = p.row + dr;
      const nc = p.col + dc;
      if (
        nr < 0 ||
        nr >= BOARD_ROWS ||
        nc < 0 ||
        nc >= BOARD_COLS ||
        board[nr][nc] !== 0
      ) {
        valid = false;
        break;
      }
    }
    if (!valid) return null; // Conflict in prefix

    for (const [dr, dc] of coords) {
      board[p.row + dr][p.col + dc] = 1;
    }
    solution.push(p);
    usedPieceIds.add(p.pieceId);
  }

  const piecesToPlace = PIECES.filter((p) => !usedPieceIds.has(p.id));

  // Find next empty cell on board (row-major order)
  function findFirstEmpty(): [number, number] | null {
    for (let r = 0; r < BOARD_ROWS; r++) {
      for (let c = 0; c < BOARD_COLS; c++) {
        if (board[r][c] === 0) return [r, c];
      }
    }
    return null;
  }

  function backtrack(remainingPieces: typeof PIECES): boolean {
    const emptyCell = findFirstEmpty();
    if (!emptyCell) {
      return remainingPieces.length === 0;
    }

    const [er, ec] = emptyCell;

    for (let i = 0; i < remainingPieces.length; i++) {
      const piece = remainingPieces[i];
      const orientations = ALL_ORIENTATIONS[piece.id] || [];

      for (const orient of orientations) {
        // We know (er, ec) is the first empty cell in row-major order.
        // Therefore, any piece placing over (er, ec) must cover it with one of its cells!
        for (const [offsetR, offsetC] of orient.coords) {
          const anchorR = er - offsetR;
          const anchorC = ec - offsetC;

          // Check if piece fits within board and on empty cells
          let canFit = true;
          for (const [dr, dc] of orient.coords) {
            const r = anchorR + dr;
            const c = anchorC + dc;
            if (
              r < 0 ||
              r >= BOARD_ROWS ||
              c < 0 ||
              c >= BOARD_COLS ||
              board[r][c] !== 0
            ) {
              canFit = false;
              break;
            }
          }

          if (canFit) {
            // Place
            for (const [dr, dc] of orient.coords) {
              board[anchorR + dr][anchorC + dc] = 1;
            }
            solution.push({
              pieceId: piece.id,
              matrix: orient.matrix,
              row: anchorR,
              col: anchorC,
              rotation: orient.rotation,
              flipped: orient.flipped,
            });

            const nextRemaining = [
              ...remainingPieces.slice(0, i),
              ...remainingPieces.slice(i + 1),
            ];

            if (backtrack(nextRemaining)) {
              return true;
            }

            // Unplace
            solution.pop();
            for (const [dr, dc] of orient.coords) {
              board[anchorR + dr][anchorC + dc] = 0;
            }
          }
        }
      }
    }

    return false;
  }

  const success = backtrack(piecesToPlace);
  return success ? solution : null;
}
