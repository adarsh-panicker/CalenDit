import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { PieceTray } from './components/PieceTray';
import { WinModal } from './components/WinModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { ArchiveModal } from './components/ArchiveModal';
import { PIECES, PIECE_MAP } from './constants/pieces';
import { BOARD_LAYOUT, BOARD_ROWS, BOARD_COLS } from './constants/board';
import type { PlacedPiece, PuzzleDate, SelectedPieceState } from './types/game';
import { getTodayDate, toDateKey } from './utils/calendar';
import { sound } from './utils/audio';
import { loadStats, recordGameWin } from './utils/storage';
import { rotateMatrix, flipMatrix, getFilledCoords } from './utils/matrix';
import { solvePuzzle } from './utils/solver';

export const App: React.FC = () => {
  const today = useMemo(() => getTodayDate(), []);
  const [currentDate, setCurrentDate] = useState<PuzzleDate>(today);
  const isToday = currentDate.month === today.month && currentDate.day === today.day;

  const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<SelectedPieceState | null>(null);

  const [timerSeconds, setTimerSeconds] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const [showWinModal, setShowWinModal] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [stats, setStats] = useState(loadStats);

  // Set of placed piece IDs
  const placedPieceIds = useMemo(
    () => new Set(placedPieces.map((p) => p.pieceId)),
    [placedPieces]
  );

  // Timer loop
  useEffect(() => {
    if (isWon) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isWon]);

  // Check victory condition whenever placedPieces changes
  useEffect(() => {
    if (placedPieces.length !== PIECES.length) {
      return;
    }

    // Verify all 8 pieces placed without errors
    const occupied = new Set<string>();
    let valid = true;

    for (const placed of placedPieces) {
      const coords = getFilledCoords(placed.matrix);
      for (const [dr, dc] of coords) {
        const r = placed.row + dr;
        const c = placed.col + dc;
        const key = `${r},${c}`;

        if (
          r < 0 ||
          r >= BOARD_ROWS ||
          c < 0 ||
          c >= BOARD_COLS ||
          occupied.has(key)
        ) {
          valid = false;
          break;
        }

        const cell = BOARD_LAYOUT[r][c];
        if (cell.type === 'blocked') {
          valid = false;
          break;
        }
        if (cell.type === 'month' && cell.monthIndex === currentDate.month) {
          valid = false;
          break;
        }
        if (cell.type === 'day' && cell.dayNumber === currentDate.day) {
          valid = false;
          break;
        }

        occupied.add(key);
      }
      if (!valid) break;
    }

    // 41 cells covered, 2 target cells uncovered
    if (valid && occupied.size === 41 && !isWon) {
      setIsWon(true);
      setShowWinModal(true);
      sound.playVictory();

      const dateKey = toDateKey(currentDate);
      const updatedStats = recordGameWin(dateKey, timerSeconds);
      setStats(updatedStats);
    }
  }, [placedPieces, currentDate, isWon, timerSeconds]);

  // Handle keyboard shortcuts (R = rotate, F = flip, Esc = deselect)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        if (selectedPiece) {
          e.preventDefault();
          handleRotateSelected();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        if (selectedPiece) {
          e.preventDefault();
          handleFlipSelected();
        }
      } else if (e.key === 'Escape') {
        setSelectedPiece(null);
        setShowWinModal(false);
        setShowHowToPlay(false);
        setShowArchive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPiece]);

  // Select piece from tray
  const handleSelectPiece = useCallback(
    (pieceId: string) => {
      if (placedPieceIds.has(pieceId)) return;

      const piece = PIECE_MAP.get(pieceId);
      if (!piece) return;

      if (selectedPiece?.pieceId === pieceId) {
        // Toggle rotation if clicked again
        handleRotateSelected();
      } else {
        sound.playSelect();
        setSelectedPiece({
          pieceId,
          matrix: piece.matrix,
          rotation: 0,
          flipped: false,
        });
      }
    },
    [placedPieceIds, selectedPiece]
  );

  // Rotate selected piece clockwise 90 deg
  const handleRotateSelected = useCallback(() => {
    if (!selectedPiece) return;
    sound.playTransform();
    setSelectedPiece((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        matrix: rotateMatrix(prev.matrix),
        rotation: (prev.rotation + 90) % 360,
      };
    });
  }, [selectedPiece]);

  // Flip selected piece horizontally
  const handleFlipSelected = useCallback(() => {
    if (!selectedPiece) return;
    sound.playTransform();
    setSelectedPiece((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        matrix: flipMatrix(prev.matrix),
        flipped: !prev.flipped,
      };
    });
  }, [selectedPiece]);

  // Place piece at anchor [row, col] on board
  const handlePlacePiece = useCallback(
    (row: number, col: number) => {
      if (!selectedPiece) return;

      sound.playSnap();
      setPlacedPieces((prev) => [
        ...prev,
        {
          pieceId: selectedPiece.pieceId,
          matrix: selectedPiece.matrix,
          row,
          col,
          rotation: selectedPiece.rotation,
          flipped: selectedPiece.flipped,
        },
      ]);
      setMoveCount((prev) => prev + 1);
      setSelectedPiece(null);
    },
    [selectedPiece]
  );

  // Remove placed piece from board back to tray
  const handleRemovePlacedPiece = useCallback((pieceId: string) => {
    sound.playSelect();
    setPlacedPieces((prev) => {
      const removed = prev.find((p) => p.pieceId === pieceId);
      if (removed) {
        // Automatically put it in hand so player can immediately re-place or rotate it!
        setSelectedPiece({
          pieceId: removed.pieceId,
          matrix: removed.matrix,
          rotation: removed.rotation,
          flipped: removed.flipped,
        });
      }
      return prev.filter((p) => p.pieceId !== pieceId);
    });
    setMoveCount((prev) => prev + 1);
  }, []);

  // Reset entire board
  const handleResetBoard = useCallback(() => {
    sound.playSelect();
    setPlacedPieces([]);
    setSelectedPiece(null);
    setMoveCount((prev) => prev + 1);
  }, []);

  // Request Hint: Solves puzzle from current board or scratch
  const handleRequestHint = useCallback(() => {
    sound.playSelect();
    // Find a valid solution
    let solution = solvePuzzle(currentDate.month, currentDate.day, placedPieces);

    if (!solution) {
      // If current placement is blocked, solve from scratch
      solution = solvePuzzle(currentDate.month, currentDate.day, []);
    }

    if (!solution || solution.length === 0) {
      sound.playError();
      return;
    }

    // Find the first piece in the solution that isn't placed yet
    const nextPiece = solution.find((p) => !placedPieceIds.has(p.pieceId));
    if (nextPiece) {
      sound.playSnap();
      setPlacedPieces((prev) => [...prev, nextPiece]);
      setHintsUsed((prev) => prev + 1);
      setMoveCount((prev) => prev + 1);
      if (selectedPiece?.pieceId === nextPiece.pieceId) {
        setSelectedPiece(null);
      }
    }
  }, [currentDate, placedPieces, placedPieceIds, selectedPiece]);

  // Load a new date
  const handleSelectDate = useCallback((newDate: PuzzleDate) => {
    setCurrentDate(newDate);
    setPlacedPieces([]);
    setSelectedPiece(null);
    setTimerSeconds(0);
    setMoveCount(0);
    setHintsUsed(0);
    setIsWon(false);
    setShowWinModal(false);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-between p-3 sm:p-5 font-sans">
      <div className="w-full max-w-2xl flex flex-col gap-4 items-center">
        {/* Header telemetry and actions */}
        <Header
          currentDate={currentDate}
          isToday={isToday}
          streak={stats.streak}
          timerSeconds={timerSeconds}
          moveCount={moveCount}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            setSoundEnabled((prev) => {
              sound.enabled = !prev;
              return !prev;
            });
          }}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          onOpenArchive={() => setShowArchive(true)}
          onResetBoard={handleResetBoard}
          onRequestHint={handleRequestHint}
          hintsUsed={hintsUsed}
        />

        {/* The 7x7 Calendar Board */}
        <Board
          currentDate={currentDate}
          placedPieces={placedPieces}
          selectedPiece={selectedPiece}
          onPlacePiece={handlePlacePiece}
          onRemovePlacedPiece={handleRemovePlacedPiece}
        />

        {/* Bottom Polyomino Tray & Rotation Controls */}
        <PieceTray
          placedPieceIds={placedPieceIds}
          selectedPiece={selectedPiece}
          onSelectPiece={handleSelectPiece}
          onRotateSelected={handleRotateSelected}
          onFlipSelected={handleFlipSelected}
          onDeselect={() => setSelectedPiece(null)}
        />
      </div>

      {/* Footer Info */}
      <footer className="mt-4 text-center text-xs text-zinc-500">
        Built for <strong>Reddit Game of the Day Hackathon 2026</strong> • Devvit Web
      </footer>

      {/* Modals */}
      {showWinModal && (
        <WinModal
          currentDate={currentDate}
          isToday={isToday}
          timeSeconds={timerSeconds}
          moveCount={moveCount}
          hintsUsed={hintsUsed}
          streak={stats.streak}
          onOpenArchive={() => setShowArchive(true)}
          onClose={() => setShowWinModal(false)}
        />
      )}

      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}

      {showArchive && (
        <ArchiveModal
          currentDate={currentDate}
          completedDates={stats.completedDates}
          onSelectDate={handleSelectDate}
          onClose={() => setShowArchive(false)}
        />
      )}
    </div>
  );
};

export default App;
