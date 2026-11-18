import type { Matrix } from '../types/game';

/**
 * Rotate matrix 90 degrees clockwise
 */
export function rotateMatrix(matrix: Matrix): Matrix {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result: Matrix = [];

  for (let c = 0; c < cols; c++) {
    const newRow: number[] = [];
    for (let r = rows - 1; r >= 0; r--) {
      newRow.push(matrix[r][c]);
    }
    result.push(newRow);
  }

  return result;
}

/**
 * Flip matrix horizontally (reflect along Y axis)
 */
export function flipMatrix(matrix: Matrix): Matrix {
  return matrix.map((row) => [...row].reverse());
}

/**
 * Transform a base piece matrix by rotation angle (0, 90, 180, 270) and flip boolean
 */
export function transformMatrix(
  baseMatrix: Matrix,
  rotation: number,
  flipped: boolean
): Matrix {
  let mat = baseMatrix;

  if (flipped) {
    mat = flipMatrix(mat);
  }

  const times = ((rotation % 360) + 360) % 360 / 90;
  for (let i = 0; i < times; i++) {
    mat = rotateMatrix(mat);
  }

  return mat;
}

/**
 * Get all relative filled cell coordinates [r, c] for a piece matrix
 */
export function getFilledCoords(matrix: Matrix): [number, number][] {
  const coords: [number, number][] = [];
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] === 1) {
        coords.push([r, c]);
      }
    }
  }
  return coords;
}
