const { generatePuzzle } = require('./sudoku');

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const POOL_SIZE = 20;
const REFILL_THRESHOLD = 10;

// 難易度ごとのパズルプール
const pools = {
  easy: [],
  medium: [],
  hard: [],
};

// 補充中フラグ（難易度ごと）
const refilling = {
  easy: false,
  medium: false,
  hard: false,
};

// 停止フラグ
let stopped = false;

// 1つのパズルをバックグラウンドで生成してプールに追加
function generateOne(difficulty) {
  return new Promise((resolve) => {
    setImmediate(() => {
      try {
        const puzzle = generatePuzzle(difficulty);
        pools[difficulty].push(puzzle);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Pool: ${difficulty} puzzle generation failed:`, err.message);
      }
      resolve();
    });
  });
}

// プールを補充（非同期・ノンブロッキング）
async function refillPool(difficulty) {
  if (refilling[difficulty]) return;
  refilling[difficulty] = true;

  try {
    while (pools[difficulty].length < POOL_SIZE && !stopped) {
      await generateOne(difficulty);
    }
  } finally {
    refilling[difficulty] = false;
  }
}

// プールからパズルを取得（プールが空ならオンデマンド生成にフォールバック）
function getPuzzle(difficulty) {
  const puzzle = pools[difficulty].shift();

  // プールが閾値以下になったらバックグラウンド補充開始
  if (pools[difficulty].length < REFILL_THRESHOLD) {
    refillPool(difficulty);
  }

  if (puzzle) {
    return puzzle;
  }

  // プールが空の場合はオンデマンド生成（従来どおり）
  return generatePuzzle(difficulty);
}

// サーバー起動時にすべての難易度のプールを初期充填
function initPools() {
  // eslint-disable-next-line no-console
  console.log('パズルプール初期化開始...');
  for (const diff of DIFFICULTIES) {
    refillPool(diff);
  }
}

// プールの状態を取得（デバッグ用）
function getPoolStatus() {
  return {
    easy: pools.easy.length,
    medium: pools.medium.length,
    hard: pools.hard.length,
  };
}

// プール停止（テスト用）
function stopPools() {
  stopped = true;
}

module.exports = { getPuzzle, initPools, getPoolStatus, stopPools };
