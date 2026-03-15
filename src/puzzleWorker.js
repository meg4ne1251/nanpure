const { parentPort } = require('worker_threads');
const { generatePuzzle } = require('./sudoku');

parentPort.on('message', (difficulty) => {
  try {
    const result = generatePuzzle(difficulty);
    parentPort.postMessage({ result });
  } catch (err) {
    parentPort.postMessage({ error: err.message });
  }
});
