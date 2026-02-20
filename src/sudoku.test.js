const { generatePuzzle } = require('./sudoku');

describe('Sudoku Puzzle Generator', () => {
  describe('generatePuzzle', () => {
    it('should generate a valid puzzle with easy difficulty', () => {
      const result = generatePuzzle('easy');

      expect(result).toHaveProperty('puzzle');
      expect(result).toHaveProperty('solution');
      expect(result).toHaveProperty('difficulty', 'easy');
      expect(result).toHaveProperty('hints');
    });

    it('should generate a valid puzzle with medium difficulty', () => {
      const result = generatePuzzle('medium');

      expect(result.difficulty).toBe('medium');
      expect(result.hints).toBeGreaterThanOrEqual(28);
      expect(result.hints).toBeLessThanOrEqual(32);
    });

    it('should generate a valid puzzle with hard difficulty', () => {
      const result = generatePuzzle('hard');

      expect(result.difficulty).toBe('hard');
      expect(result.hints).toBeGreaterThanOrEqual(22);
      expect(result.hints).toBeLessThanOrEqual(26);
    });

    it('should generate puzzles with correct hint counts', () => {
      const easy = generatePuzzle('easy');
      const medium = generatePuzzle('medium');
      const hard = generatePuzzle('hard');

      expect(easy.hints).toBeGreaterThanOrEqual(36);
      expect(easy.hints).toBeLessThanOrEqual(40);

      expect(medium.hints).toBeGreaterThanOrEqual(28);
      expect(medium.hints).toBeLessThanOrEqual(32);

      expect(hard.hints).toBeGreaterThanOrEqual(22);
      expect(hard.hints).toBeLessThanOrEqual(26);
    });

    it('should return valid 9x9 grids', () => {
      const result = generatePuzzle('medium');

      expect(result.puzzle).toHaveLength(9);
      expect(result.solution).toHaveLength(9);

      result.puzzle.forEach((row) => {
        expect(row).toHaveLength(9);
        row.forEach((cell) => {
          expect(cell).toBeGreaterThanOrEqual(0);
          expect(cell).toBeLessThanOrEqual(9);
          expect(Number.isInteger(cell)).toBe(true);
        });
      });
    });

    it('should have solution with all values filled', () => {
      const result = generatePuzzle('medium');

      result.solution.forEach((row) => {
        row.forEach((cell) => {
          expect(cell).toBeGreaterThanOrEqual(1);
          expect(cell).toBeLessThanOrEqual(9);
        });
      });
    });

    it('should have puzzle cells that match solution where given', () => {
      const result = generatePuzzle('medium');

      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (result.puzzle[r][c] !== 0) {
            expect(result.puzzle[r][c]).toBe(result.solution[r][c]);
          }
        }
      }
    });

    it('should generate different puzzles each time', () => {
      const puzzle1 = generatePuzzle('medium');
      const puzzle2 = generatePuzzle('medium');

      // Very unlikely to generate the same puzzle twice
      const same = JSON.stringify(puzzle1.puzzle) === JSON.stringify(puzzle2.puzzle);
      expect(same).toBe(false);
    });

    it('should default to medium difficulty', () => {
      const result = generatePuzzle();
      expect(result.difficulty).toBe('medium');
    });
  });
});
