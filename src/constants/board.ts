import type { BoardCell } from '../types/game';

export const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
] as const;

/**
 * Standard 7x7 DragonFjord A-Puzzle-A-Day Calendar Grid layout
 * Rows 0-1: 6 columns of months each (col 6 blocked)
 * Rows 2-5: 7 columns of days (1-28)
 * Row 6: 3 columns of days (29-31, cols 3-6 blocked)
 */
export const BOARD_LAYOUT: BoardCell[][] = [
  // Row 0
  [
    { row: 0, col: 0, type: 'month', label: 'JAN', monthIndex: 0 },
    { row: 0, col: 1, type: 'month', label: 'FEB', monthIndex: 1 },
    { row: 0, col: 2, type: 'month', label: 'MAR', monthIndex: 2 },
    { row: 0, col: 3, type: 'month', label: 'APR', monthIndex: 3 },
    { row: 0, col: 4, type: 'month', label: 'MAY', monthIndex: 4 },
    { row: 0, col: 5, type: 'month', label: 'JUN', monthIndex: 5 },
    { row: 0, col: 6, type: 'blocked', label: '' },
  ],
  // Row 1
  [
    { row: 1, col: 0, type: 'month', label: 'JUL', monthIndex: 6 },
    { row: 1, col: 1, type: 'month', label: 'AUG', monthIndex: 7 },
    { row: 1, col: 2, type: 'month', label: 'SEP', monthIndex: 8 },
    { row: 1, col: 3, type: 'month', label: 'OCT', monthIndex: 9 },
    { row: 1, col: 4, type: 'month', label: 'NOV', monthIndex: 10 },
    { row: 1, col: 5, type: 'month', label: 'DEC', monthIndex: 11 },
    { row: 1, col: 6, type: 'blocked', label: '' },
  ],
  // Row 2: Days 1 - 7
  [
    { row: 2, col: 0, type: 'day', label: '1', dayNumber: 1 },
    { row: 2, col: 1, type: 'day', label: '2', dayNumber: 2 },
    { row: 2, col: 2, type: 'day', label: '3', dayNumber: 3 },
    { row: 2, col: 3, type: 'day', label: '4', dayNumber: 4 },
    { row: 2, col: 4, type: 'day', label: '5', dayNumber: 5 },
    { row: 2, col: 5, type: 'day', label: '6', dayNumber: 6 },
    { row: 2, col: 6, type: 'day', label: '7', dayNumber: 7 },
  ],
  // Row 3: Days 8 - 14
  [
    { row: 3, col: 0, type: 'day', label: '8', dayNumber: 8 },
    { row: 3, col: 1, type: 'day', label: '9', dayNumber: 9 },
    { row: 3, col: 2, type: 'day', label: '10', dayNumber: 10 },
    { row: 3, col: 3, type: 'day', label: '11', dayNumber: 11 },
    { row: 3, col: 4, type: 'day', label: '12', dayNumber: 12 },
    { row: 3, col: 5, type: 'day', label: '13', dayNumber: 13 },
    { row: 3, col: 6, type: 'day', label: '14', dayNumber: 14 },
  ],
  // Row 4: Days 15 - 21
  [
    { row: 4, col: 0, type: 'day', label: '15', dayNumber: 15 },
    { row: 4, col: 1, type: 'day', label: '16', dayNumber: 16 },
    { row: 4, col: 2, type: 'day', label: '17', dayNumber: 17 },
    { row: 4, col: 3, type: 'day', label: '18', dayNumber: 18 },
    { row: 4, col: 4, type: 'day', label: '19', dayNumber: 19 },
    { row: 4, col: 5, type: 'day', label: '20', dayNumber: 20 },
    { row: 4, col: 6, type: 'day', label: '21', dayNumber: 21 },
  ],
  // Row 5: Days 22 - 28
  [
    { row: 5, col: 0, type: 'day', label: '22', dayNumber: 22 },
    { row: 5, col: 1, type: 'day', label: '23', dayNumber: 23 },
    { row: 5, col: 2, type: 'day', label: '24', dayNumber: 24 },
    { row: 5, col: 3, type: 'day', label: '25', dayNumber: 25 },
    { row: 5, col: 4, type: 'day', label: '26', dayNumber: 26 },
    { row: 5, col: 5, type: 'day', label: '27', dayNumber: 27 },
    { row: 5, col: 6, type: 'day', label: '28', dayNumber: 28 },
  ],
  // Row 6: Days 29 - 31 (cols 3-6 blocked)
  [
    { row: 6, col: 0, type: 'day', label: '29', dayNumber: 29 },
    { row: 6, col: 1, type: 'day', label: '30', dayNumber: 30 },
    { row: 6, col: 2, type: 'day', label: '31', dayNumber: 31 },
    { row: 6, col: 3, type: 'blocked', label: '' },
    { row: 6, col: 4, type: 'blocked', label: '' },
    { row: 6, col: 5, type: 'blocked', label: '' },
    { row: 6, col: 6, type: 'blocked', label: '' },
  ],
];

export const TOTAL_ACTIVE_CELLS = 43;
export const BOARD_ROWS = 7;
export const BOARD_COLS = 7;

/**
 * Helper to find coordinate of month & day on the board
 */
export function getTargetCoordinates(monthIndex: number, dayNumber: number): {
  monthCoord: [number, number];
  dayCoord: [number, number];
} {
  let monthCoord: [number, number] = [0, 0];
  let dayCoord: [number, number] = [2, 0];

  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const cell = BOARD_LAYOUT[r][c];
      if (cell.type === 'month' && cell.monthIndex === monthIndex) {
        monthCoord = [r, c];
      }
      if (cell.type === 'day' && cell.dayNumber === dayNumber) {
        dayCoord = [r, c];
      }
    }
  }

  return { monthCoord, dayCoord };
}
