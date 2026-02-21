const express = require('express');
const path = require('path');
const { generatePuzzle } = require('./sudoku');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));

// パズル生成API
// eslint-disable-next-line consistent-return
app.get('/api/puzzle', (req, res) => {
  const difficulty = req.query.difficulty || 'medium';
  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({ error: 'Invalid difficulty. Use: easy, medium, hard' });
  }
  const result = generatePuzzle(difficulty);
  return res.json(result);
});

// Only start server if this file is run directly (not imported for testing)
if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`ナンプレサーバー起動: http://localhost:${PORT}`);
  });
}

module.exports = app;
