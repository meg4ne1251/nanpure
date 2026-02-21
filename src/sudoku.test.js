const { generatePuzzle, gradePuzzle, classifyDifficulty } = require('./sudoku');

describe('Sudoku Puzzle Generator', () => {
  describe('generatePuzzle', () => {
    it('should generate a valid puzzle with required properties', () => {
      const result = generatePuzzle('easy');

      expect(result).toHaveProperty('puzzle');
      expect(result).toHaveProperty('solution');
      expect(result).toHaveProperty('difficulty', 'easy');
      expect(result).toHaveProperty('hints');
      expect(result).toHaveProperty('grade');
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

    it('should have solution with all values filled (1-9)', () => {
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

      const same = JSON.stringify(puzzle1.puzzle) === JSON.stringify(puzzle2.puzzle);
      expect(same).toBe(false);
    });

    it('should default to medium difficulty', () => {
      const result = generatePuzzle();
      expect(result.difficulty).toBe('medium');
    });
  });

  describe('difficulty grading', () => {
    it('should include grade info with techniques used', () => {
      const result = generatePuzzle('easy');

      expect(result.grade).toBeDefined();
      expect(result.grade).toHaveProperty('totalScore');
      expect(result.grade).toHaveProperty('maxTechniqueLevel');
      expect(result.grade).toHaveProperty('techniquesUsed');
      expect(result.grade.totalScore).toBeGreaterThan(0);
    });

    it('easy puzzles should use only basic techniques', () => {
      const result = generatePuzzle('easy');

      if (result.grade) {
        // Easy should primarily use naked and hidden singles
        expect(result.grade.maxTechniqueLevel).toBeLessThanOrEqual(2);
      }
    });

    it('should classify difficulty based on techniques', () => {
      const easyResult = generatePuzzle('easy');
      const hardResult = generatePuzzle('hard');

      if (easyResult.grade && hardResult.grade) {
        expect(easyResult.grade.totalScore).toBeLessThanOrEqual(
          hardResult.grade.totalScore + 50
        );
      }
    }, 15000);
  });

  describe('gradePuzzle', () => {
    it('should return grade result for a valid puzzle', () => {
      const result = generatePuzzle('easy');
      const grade = gradePuzzle(result.puzzle);

      expect(grade).toBeDefined();
      expect(grade).toHaveProperty('solved');
      expect(grade).toHaveProperty('totalScore');
      expect(grade).toHaveProperty('techniquesUsed');
    });
  });

  describe('classifyDifficulty', () => {
    it('should return null for unsolved grades', () => {
      expect(classifyDifficulty(null)).toBe(null);
      expect(classifyDifficulty({ solved: false, totalScore: 0, maxTechniqueLevel: 0 })).toBe(null);
    });

    it('should classify low scores as easy', () => {
      const result = classifyDifficulty({
        solved: true,
        totalScore: 50,
        maxTechniqueLevel: 2,
        techniquesUsed: { nakedSingle: 20, hiddenSingle: 15 },
      });
      expect(result).toBe('easy');
    });

    it('should classify high technique levels as hard', () => {
      const result = classifyDifficulty({
        solved: true,
        totalScore: 300,
        maxTechniqueLevel: 15,
        techniquesUsed: { nakedSingle: 10, backtrack: 1 },
      });
      expect(result).toBe('hard');
    });
  });
});
