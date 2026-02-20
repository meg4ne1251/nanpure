/**
 * 数独パズル生成エンジン
 * - 完全にランダムな盤面を生成
 * - 難易度に応じてセルを除去
 * - 唯一解を保証
 */

// Fisher-Yates シャッフル
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 指定位置に値を配置可能か判定
function isValid(board, row, col, num) {
  // 行チェック
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }
  // 列チェック
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }
  // 3x3ボックスチェック
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

// バックトラッキングで完成盤面を生成
function fillBoard(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// 解の数をカウント（最大maxCountまで）
function countSolutions(board, maxCount = 2) {
  let count = 0;

  function solve() {
    if (count >= maxCount) return;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              solve();
              board[row][col] = 0;
              if (count >= maxCount) return;
            }
          }
          return;
        }
      }
    }
    count++;
  }

  solve();
  return count;
}

// 難易度設定
// ヒント数: 初級36-40, 中級28-32, 上級22-26
const DIFFICULTY = {
  easy: { minHints: 36, maxHints: 40 },
  medium: { minHints: 28, maxHints: 32 },
  hard: { minHints: 22, maxHints: 26 },
};

// パズル生成
function generatePuzzle(difficulty = 'medium') {
  const config = DIFFICULTY[difficulty] || DIFFICULTY.medium;
  const targetHints =
    config.minHints +
    Math.floor(Math.random() * (config.maxHints - config.minHints + 1));

  // 完成盤面を生成
  const solution = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillBoard(solution);

  // パズル盤面を作成（セルを除去）
  const puzzle = solution.map((row) => [...row]);
  const cellsToRemove = 81 - targetHints;

  // 全セル位置をランダムに並べる
  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9])
  );

  let removed = 0;
  for (const [row, col] of positions) {
    if (removed >= cellsToRemove) break;

    const backup = puzzle[row][col];
    puzzle[row][col] = 0;

    // 唯一解かチェック
    const boardCopy = puzzle.map((r) => [...r]);
    if (countSolutions(boardCopy) === 1) {
      removed++;
    } else {
      puzzle[row][col] = backup;
    }
  }

  return {
    puzzle: puzzle,
    solution: solution,
    difficulty: difficulty,
    hints: 81 - removed,
  };
}

module.exports = { generatePuzzle };
