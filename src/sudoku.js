/**
 * 数独パズル生成エンジン
 * - 完全にランダムな盤面を生成
 * - 人間の解法テクニックに基づく難易度判定
 * - 難易度に合致するパズルのみを出力
 * - 唯一解を保証
 */

// ============================================================
// ユーティリティ
// ============================================================

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isValid(board, row, col, num) {
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

// ============================================================
// 完成盤面の生成
// ============================================================

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

// ============================================================
// 唯一解チェック
// ============================================================

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

// ============================================================
// 論理的解法ソルバー（難易度判定用）
// 人間が使う手筋をシミュレートし、使用テクニックを記録する
// ============================================================

// 候補数字を全セルで計算
function buildCandidates(board) {
  const cands = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => new Set())
  );
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        for (let n = 1; n <= 9; n++) {
          if (isValid(board, r, c, n)) {
            cands[r][c].add(n);
          }
        }
      }
    }
  }
  return cands;
}

// ユニット（行・列・ボックス）のセル座標一覧を取得
function getRowCells(r) {
  return Array.from({ length: 9 }, (_, c) => [r, c]);
}

function getColCells(c) {
  return Array.from({ length: 9 }, (_, r) => [r, c]);
}

function getBoxCells(r, c) {
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  const cells = [];
  for (let rr = br; rr < br + 3; rr++) {
    for (let cc = bc; cc < bc + 3; cc++) {
      cells.push([rr, cc]);
    }
  }
  return cells;
}

// --- テクニック1: Naked Single ---
// セルに候補が1つしかない → 確定
function nakedSingle(board, cands) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0 && cands[r][c].size === 1) {
        const val = [...cands[r][c]][0];
        return { r, c, val };
      }
    }
  }
  return null;
}

// --- テクニック2: Hidden Single ---
// ユニット内で、ある数字が入れるセルが1つだけ → 確定
function hiddenSingle(board, cands) {
  const unitGetters = [];
  for (let i = 0; i < 9; i++) {
    unitGetters.push(getRowCells(i));
    unitGetters.push(getColCells(i));
  }
  for (let br = 0; br < 9; br += 3) {
    for (let bc = 0; bc < 9; bc += 3) {
      unitGetters.push(getBoxCells(br, bc));
    }
  }

  for (const cells of unitGetters) {
    for (let n = 1; n <= 9; n++) {
      const possibleCells = cells.filter(
        ([r, c]) => board[r][c] === 0 && cands[r][c].has(n)
      );
      if (possibleCells.length === 1) {
        const [r, c] = possibleCells[0];
        return { r, c, val: n };
      }
    }
  }
  return null;
}

// --- テクニック3: Naked Pairs ---
// ユニット内の2セルが同じ候補2つを持つ → 他のセルからその2数字を除去
function nakedPairs(board, cands) {
  let changed = false;
  const units = getAllUnits();

  for (const cells of units) {
    const emptyCells = cells.filter(([r, c]) => board[r][c] === 0);
    for (let i = 0; i < emptyCells.length; i++) {
      const [r1, c1] = emptyCells[i];
      if (cands[r1][c1].size !== 2) continue;

      for (let j = i + 1; j < emptyCells.length; j++) {
        const [r2, c2] = emptyCells[j];
        if (cands[r2][c2].size !== 2) continue;

        // 同じ候補2つか？
        const s1 = [...cands[r1][c1]];
        const s2 = [...cands[r2][c2]];
        if (s1[0] === s2[0] && s1[1] === s2[1]) {
          // 他のセルからこの2数字を除去
          for (const [r, c] of emptyCells) {
            if ((r === r1 && c === c1) || (r === r2 && c === c2)) continue;
            for (const n of s1) {
              if (cands[r][c].has(n)) {
                cands[r][c].delete(n);
                changed = true;
              }
            }
          }
        }
      }
    }
  }
  return changed;
}

// --- テクニック4: Pointing Pairs / Box-Line Reduction ---
// ボックス内のある数字の候補が1行(列)に限定されている
// → その行(列)の他のボックス部分からその数字を除去
function pointingPairs(board, cands) {
  let changed = false;

  for (let br = 0; br < 9; br += 3) {
    for (let bc = 0; bc < 9; bc += 3) {
      const boxCells = getBoxCells(br, bc);

      for (let n = 1; n <= 9; n++) {
        const cells = boxCells.filter(
          ([r, c]) => board[r][c] === 0 && cands[r][c].has(n)
        );
        if (cells.length < 2 || cells.length > 3) continue;

        // 全て同じ行？
        const rows = new Set(cells.map(([r]) => r));
        if (rows.size === 1) {
          const row = [...rows][0];
          for (let c = 0; c < 9; c++) {
            if (c >= bc && c < bc + 3) continue;
            if (cands[row][c].has(n)) {
              cands[row][c].delete(n);
              changed = true;
            }
          }
        }

        // 全て同じ列？
        const cols = new Set(cells.map(([, c]) => c));
        if (cols.size === 1) {
          const col = [...cols][0];
          for (let r = 0; r < 9; r++) {
            if (r >= br && r < br + 3) continue;
            if (cands[r][col].has(n)) {
              cands[r][col].delete(n);
              changed = true;
            }
          }
        }
      }
    }
  }
  return changed;
}

// --- テクニック5: Hidden Pairs ---
// ユニット内で2つの数字が同じ2セルにしか入らない
// → その2セルから他の候補を除去
function hiddenPairs(board, cands) {
  let changed = false;
  const units = getAllUnits();

  for (const cells of units) {
    const emptyCells = cells.filter(([r, c]) => board[r][c] === 0);

    // 各数字がどのセルに入れるか
    const numToPositions = new Map();
    for (let n = 1; n <= 9; n++) {
      const positions = emptyCells.filter(([r, c]) => cands[r][c].has(n));
      if (positions.length === 2) {
        numToPositions.set(n, positions);
      }
    }

    const nums = [...numToPositions.keys()];
    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        const pos1 = numToPositions.get(nums[i]);
        const pos2 = numToPositions.get(nums[j]);

        // 同じ2セルか？
        if (
          pos1[0][0] === pos2[0][0] && pos1[0][1] === pos2[0][1] &&
          pos1[1][0] === pos2[1][0] && pos1[1][1] === pos2[1][1]
        ) {
          const pairNums = new Set([nums[i], nums[j]]);
          for (const [r, c] of pos1) {
            for (const n of [...cands[r][c]]) {
              if (!pairNums.has(n)) {
                cands[r][c].delete(n);
                changed = true;
              }
            }
          }
        }
      }
    }
  }
  return changed;
}

// --- テクニック6: Naked Triples ---
// ユニット内の3セルが3つの候補の部分集合を持つ → 他のセルからそれらを除去
function nakedTriples(board, cands) {
  let changed = false;
  const units = getAllUnits();

  for (const cells of units) {
    const emptyCells = cells.filter(([r, c]) => board[r][c] === 0 && cands[r][c].size >= 2 && cands[r][c].size <= 3);

    if (emptyCells.length < 3) continue;

    for (let i = 0; i < emptyCells.length; i++) {
      for (let j = i + 1; j < emptyCells.length; j++) {
        for (let k = j + 1; k < emptyCells.length; k++) {
          const union = new Set([
            ...cands[emptyCells[i][0]][emptyCells[i][1]],
            ...cands[emptyCells[j][0]][emptyCells[j][1]],
            ...cands[emptyCells[k][0]][emptyCells[k][1]],
          ]);

          if (union.size === 3) {
            const triplePositions = new Set([
              `${emptyCells[i][0]},${emptyCells[i][1]}`,
              `${emptyCells[j][0]},${emptyCells[j][1]}`,
              `${emptyCells[k][0]},${emptyCells[k][1]}`,
            ]);
            const allEmpty = cells.filter(([r, c]) => board[r][c] === 0);
            for (const [r, c] of allEmpty) {
              if (triplePositions.has(`${r},${c}`)) continue;
              for (const n of union) {
                if (cands[r][c].has(n)) {
                  cands[r][c].delete(n);
                  changed = true;
                }
              }
            }
          }
        }
      }
    }
  }
  return changed;
}

// --- テクニック7: X-Wing ---
// 2つの行で、ある数字の候補が同じ2列にしかない
// → その2列の他の行からその数字を除去（列方向も同様）
function xWing(board, cands) {
  let changed = false;

  for (let n = 1; n <= 9; n++) {
    // 行ベース
    const rowPositions = [];
    for (let r = 0; r < 9; r++) {
      const cols = [];
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0 && cands[r][c].has(n)) cols.push(c);
      }
      if (cols.length === 2) rowPositions.push({ row: r, cols });
    }

    for (let i = 0; i < rowPositions.length; i++) {
      for (let j = i + 1; j < rowPositions.length; j++) {
        if (
          rowPositions[i].cols[0] === rowPositions[j].cols[0] &&
          rowPositions[i].cols[1] === rowPositions[j].cols[1]
        ) {
          const [c1, c2] = rowPositions[i].cols;
          const r1 = rowPositions[i].row;
          const r2 = rowPositions[j].row;
          for (let r = 0; r < 9; r++) {
            if (r === r1 || r === r2) continue;
            if (cands[r][c1].has(n)) { cands[r][c1].delete(n); changed = true; }
            if (cands[r][c2].has(n)) { cands[r][c2].delete(n); changed = true; }
          }
        }
      }
    }

    // 列ベース
    const colPositions = [];
    for (let c = 0; c < 9; c++) {
      const rows = [];
      for (let r = 0; r < 9; r++) {
        if (board[r][c] === 0 && cands[r][c].has(n)) rows.push(r);
      }
      if (rows.length === 2) colPositions.push({ col: c, rows });
    }

    for (let i = 0; i < colPositions.length; i++) {
      for (let j = i + 1; j < colPositions.length; j++) {
        if (
          colPositions[i].rows[0] === colPositions[j].rows[0] &&
          colPositions[i].rows[1] === colPositions[j].rows[1]
        ) {
          const [r1, r2] = colPositions[i].rows;
          const c1 = colPositions[i].col;
          const c2 = colPositions[j].col;
          for (let c = 0; c < 9; c++) {
            if (c === c1 || c === c2) continue;
            if (cands[r1][c].has(n)) { cands[r1][c].delete(n); changed = true; }
            if (cands[r2][c].has(n)) { cands[r2][c].delete(n); changed = true; }
          }
        }
      }
    }
  }
  return changed;
}

// 全ユニット一覧
function getAllUnits() {
  const units = [];
  for (let i = 0; i < 9; i++) {
    units.push(getRowCells(i));
    units.push(getColCells(i));
  }
  for (let br = 0; br < 9; br += 3) {
    for (let bc = 0; bc < 9; bc += 3) {
      units.push(getBoxCells(br, bc));
    }
  }
  return units;
}

// ============================================================
// テクニック難易度スコア
// ============================================================

const TECHNIQUE_SCORE = {
  nakedSingle: 1,     // 最も基本
  hiddenSingle: 2,    // 基本
  nakedPairs: 4,      // 中級
  pointingPairs: 4,   // 中級
  hiddenPairs: 5,     // 中級やや上
  nakedTriples: 6,    // やや上級
  xWing: 8,           // 上級
  backtrack: 15,      // 試行錯誤が必要 = 非常に難しい
};

// ============================================================
// 論理的ソルバー: パズルを解きながら難易度スコアを算出
// ============================================================

function gradePuzzle(puzzleBoard) {
  const board = puzzleBoard.map((row) => [...row]);
  const cands = buildCandidates(board);
  const techniquesUsed = {};
  let totalScore = 0;
  let maxTechniqueLevel = 0;

  function recordTechnique(name) {
    techniquesUsed[name] = (techniquesUsed[name] || 0) + 1;
    totalScore += TECHNIQUE_SCORE[name];
    if (TECHNIQUE_SCORE[name] > maxTechniqueLevel) {
      maxTechniqueLevel = TECHNIQUE_SCORE[name];
    }
  }

  function placeNumber(r, c, val) {
    board[r][c] = val;
    cands[r][c].clear();

    // 関連セルの候補から除去
    for (let i = 0; i < 9; i++) {
      cands[r][i].delete(val);
      cands[i][c].delete(val);
    }
    const br = Math.floor(r / 3) * 3;
    const bc = Math.floor(c / 3) * 3;
    for (let rr = br; rr < br + 3; rr++) {
      for (let cc = bc; cc < bc + 3; cc++) {
        cands[rr][cc].delete(val);
      }
    }
  }

  function isSolved() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) return false;
      }
    }
    return true;
  }

  function hasContradiction() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0 && cands[r][c].size === 0) return true;
      }
    }
    return false;
  }

  // メインループ: テクニックを易しい順に適用
  const MAX_ITERATIONS = 500;
  let iterations = 0;

  while (!isSolved() && iterations < MAX_ITERATIONS) {
    iterations++;
    if (hasContradiction()) return null; // 矛盾 → 解なし

    // テクニック1: Naked Single
    const ns = nakedSingle(board, cands);
    if (ns) {
      recordTechnique('nakedSingle');
      placeNumber(ns.r, ns.c, ns.val);
      continue;
    }

    // テクニック2: Hidden Single
    const hs = hiddenSingle(board, cands);
    if (hs) {
      recordTechnique('hiddenSingle');
      placeNumber(hs.r, hs.c, hs.val);
      continue;
    }

    // テクニック3: Naked Pairs（候補削減のみ）
    if (nakedPairs(board, cands)) {
      recordTechnique('nakedPairs');
      continue;
    }

    // テクニック4: Pointing Pairs
    if (pointingPairs(board, cands)) {
      recordTechnique('pointingPairs');
      continue;
    }

    // テクニック5: Hidden Pairs
    if (hiddenPairs(board, cands)) {
      recordTechnique('hiddenPairs');
      continue;
    }

    // テクニック6: Naked Triples
    if (nakedTriples(board, cands)) {
      recordTechnique('nakedTriples');
      continue;
    }

    // テクニック7: X-Wing
    if (xWing(board, cands)) {
      recordTechnique('xWing');
      continue;
    }

    // どのテクニックも適用不可 → バックトラック扱い
    // 実際にバックトラックで解くのではなく、スコアに反映して終了
    recordTechnique('backtrack');
    break;
  }

  return {
    solved: isSolved(),
    totalScore,
    maxTechniqueLevel,
    techniquesUsed,
  };
}

// ============================================================
// スコアに基づく難易度分類
// ============================================================

// 難易度判定
// easy:   基本テクニック(Naked/Hidden Single)のみで解ける
// medium: 中級テクニックが必要、またはスコアが中程度
// hard:   上級テクニック、高スコア、バックトラック
function classifyDifficulty(gradeResult) {
  if (!gradeResult || !gradeResult.solved) return null;

  const { maxTechniqueLevel, totalScore } = gradeResult;

  if (maxTechniqueLevel <= TECHNIQUE_SCORE.hiddenSingle && totalScore <= 100) {
    return 'easy';
  }
  if (totalScore <= 70) {
    return 'medium';
  }
  return 'hard';
}

// ============================================================
// パズル生成
// ============================================================

// 難易度ごとの設定
// acceptClassified: この分類結果なら受け入れる（配列）
// 生成の安定性のため、隣接難易度も許容するが、主分類を優先
const DIFFICULTY_CONFIG = {
  easy: {
    targetRemove: 40,    // 目標除去数 → ヒント41程度
    maxRemove: 45,       // 最大除去数 → ヒント36程度
    accept: ['easy'],
  },
  medium: {
    targetRemove: 50,
    maxRemove: 55,
    accept: ['medium'],
  },
  hard: {
    targetRemove: 54,
    maxRemove: 58,
    accept: ['hard', 'medium'], // hardが出にくい場合mediumも許容
  },
};

// パズル盤面を生成
function createPuzzleBoard(solution, maxRemove) {
  const puzzle = solution.map((row) => [...row]);
  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9])
  );

  let removed = 0;
  for (const [row, col] of positions) {
    if (removed >= maxRemove) break;
    const backup = puzzle[row][col];
    puzzle[row][col] = 0;
    const boardCopy = puzzle.map((r) => [...r]);
    if (countSolutions(boardCopy) === 1) {
      removed++;
    } else {
      puzzle[row][col] = backup;
    }
  }
  return { puzzle, removed };
}

function generatePuzzle(difficulty = 'medium') {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const TIME_LIMIT = 5000; // 5秒制限
  const startTime = Date.now();
  let bestResult = null;
  let bestScoreDiff = Infinity;

  while (Date.now() - startTime < TIME_LIMIT) {
    const solution = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillBoard(solution);

    // 同じ盤面から2パターン試す
    for (let v = 0; v < 2; v++) {
      if (Date.now() - startTime >= TIME_LIMIT) break;

      const removeTarget = config.targetRemove +
        Math.floor(Math.random() * (config.maxRemove - config.targetRemove + 1));
      const { puzzle, removed } = createPuzzleBoard(solution, removeTarget);

      const grade = gradePuzzle(puzzle);
      if (!grade || !grade.solved) continue;

      const classified = classifyDifficulty(grade);
      const hints = 81 - removed;
      const result = {
        puzzle,
        solution,
        difficulty,
        hints,
        grade: {
          totalScore: grade.totalScore,
          maxTechniqueLevel: grade.maxTechniqueLevel,
          techniquesUsed: grade.techniquesUsed,
        },
      };

      // 完全一致 → 即座に返す
      if (classified === difficulty) {
        return result;
      }

      // 許容リスト内で最も近いものを保持
      if (config.accept.includes(classified)) {
        // スコア差が小さいものを優先
        const targetScore = difficulty === 'easy' ? 50 : difficulty === 'medium' ? 65 : 80;
        const diff = Math.abs(grade.totalScore - targetScore);
        if (diff < bestScoreDiff) {
          bestScoreDiff = diff;
          bestResult = result;
        }
      }
    }
  }

  // 時間内に完全一致が見つからなかった → ベスト候補を返す
  if (bestResult) return bestResult;

  // フォールバック
  const solution = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillBoard(solution);
  const { puzzle, removed } = createPuzzleBoard(solution, config.targetRemove);
  const grade = gradePuzzle(puzzle);

  return {
    puzzle,
    solution,
    difficulty,
    hints: 81 - removed,
    grade: grade ? {
      totalScore: grade.totalScore,
      maxTechniqueLevel: grade.maxTechniqueLevel,
      techniquesUsed: grade.techniquesUsed,
    } : null,
  };
}

module.exports = { generatePuzzle, gradePuzzle, classifyDifficulty };
