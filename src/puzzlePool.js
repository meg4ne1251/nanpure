const { Worker } = require('worker_threads');
const path = require('path');

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const POOL_SIZE = 15;
const REFILL_THRESHOLD = 7;

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

// 実行中のWorker追跡
const activeWorkers = new Set();

// Workerスレッドでパズルを1つ生成
function generateOneInWorker(difficulty) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'puzzleWorker.js'));
    activeWorkers.add(worker);
    let settled = false;
    worker.on('message', (msg) => {
      settled = true;
      activeWorkers.delete(worker);
      worker.terminate();
      if (msg.error) {
        reject(new Error(msg.error));
      } else {
        resolve(msg.result);
      }
    });
    worker.on('error', (err) => {
      settled = true;
      activeWorkers.delete(worker);
      worker.terminate();
      reject(err);
    });
    worker.on('exit', (code) => {
      activeWorkers.delete(worker);
      if (!settled) {
        reject(new Error(`Worker exited unexpectedly with code ${code}`));
      }
    });
    worker.postMessage(difficulty);
  });
}

// プールを補充（Workerスレッドで非同期・ノンブロッキング）
async function refillPool(difficulty) {
  if (refilling[difficulty]) return;
  refilling[difficulty] = true;

  try {
    while (pools[difficulty].length < POOL_SIZE && !stopped) {
      try {
        const puzzle = await generateOneInWorker(difficulty);
        pools[difficulty].push(puzzle);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Pool: ${difficulty} puzzle generation failed:`, err.message);
      }
    }
  } finally {
    refilling[difficulty] = false;
  }
}

// プールからパズルを取得（プールが空ならWorkerで生成にフォールバック）
async function getPuzzle(difficulty) {
  const puzzle = pools[difficulty].shift();

  // プールが閾値以下になったらバックグラウンド補充開始
  if (pools[difficulty].length < REFILL_THRESHOLD) {
    refillPool(difficulty);
  }

  if (puzzle) {
    return puzzle;
  }

  // プールが空の場合はWorkerスレッドで生成（メインスレッドをブロックしない）
  return generateOneInWorker(difficulty);
}

// サーバー起動時にすべての難易度のプールを初期充填
function initPools() {
  stopped = false;
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

// プール停止（テスト・シャットダウン用）
function stopPools() {
  stopped = true;
  for (const worker of activeWorkers) {
    worker.terminate();
  }
  activeWorkers.clear();
}

module.exports = { getPuzzle, initPools, getPoolStatus, stopPools };
