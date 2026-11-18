import type { PieceDef } from '../types/game';

/**
 * The 8 standard DragonFjord polyomino pieces:
 * 1. 2x3 rectangle (area: 6)
 * 2. L-pentomino (area: 5)
 * 3. U-pentomino (area: 5)
 * 4. V-pentomino (area: 5)
 * 5. P-pentomino (area: 5)
 * 6. Y-pentomino (area: 5)
 * 7. Z-pentomino (area: 5)
 * 8. F-pentomino (area: 5)
 * Total area = 41 squares.
 */
export const PIECES: PieceDef[] = [
  {
    id: 'rect2x3',
    name: '2×3 Block',
    color: '#FF4500', // Reddit OrangeRed
    accentColor: '#FF6433',
    borderColor: '#CC3700',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
    ],
  },
  {
    id: 'l_pent',
    name: 'L-Piece',
    color: '#0079D3', // Reddit Blue
    accentColor: '#249BFF',
    borderColor: '#005FA6',
    matrix: [
      [1, 0],
      [1, 0],
      [1, 0],
      [1, 1],
    ],
  },
  {
    id: 'u_pent',
    name: 'U-Piece',
    color: '#00A68A', // Teal / Green
    accentColor: '#28D7B5',
    borderColor: '#007C67',
    matrix: [
      [1, 0, 1],
      [1, 1, 1],
    ],
  },
  {
    id: 'v_pent',
    name: 'V-Piece',
    color: '#FFB000', // Gold / Karma yellow
    accentColor: '#FFC84D',
    borderColor: '#CC8D00',
    matrix: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
  },
  {
    id: 'p_pent',
    name: 'P-Piece',
    color: '#7193FF', // Periwinkle
    accentColor: '#9BB4FF',
    borderColor: '#4A6FD4',
    matrix: [
      [1, 1],
      [1, 1],
      [1, 0],
    ],
  },
  {
    id: 'y_pent',
    name: 'Y-Piece',
    color: '#A05CF6', // Purple
    accentColor: '#B782FF',
    borderColor: '#7A35D6',
    matrix: [
      [0, 1],
      [1, 1],
      [0, 1],
      [0, 1],
    ],
  },
  {
    id: 'z_pent',
    name: 'Z-Piece',
    color: '#FF3881', // Neon Berry Pink
    accentColor: '#FF6BA3',
    borderColor: '#CC2060',
    matrix: [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
  },
  {
    id: 'f_pent',
    name: 'F-Piece',
    color: '#46D160', // Mint Green
    accentColor: '#70E385',
    borderColor: '#2FA845',
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 1, 0],
    ],
  },
];

export const PIECE_MAP = new Map<string, PieceDef>(
  PIECES.map((piece) => [piece.id, piece])
);
