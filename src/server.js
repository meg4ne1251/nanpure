const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { generatePuzzle } = require('./sudoku');

const app = express();
const PORT = process.env.PORT || 3000;

// セキュリティヘッダー
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://pagead2.googlesyndication.com',
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        frameSrc: ['https://googleads.g.doubleclick.net', 'https://tpc.googlesyndication.com'],
        connectSrc: ["'self'", 'https://pagead2.googlesyndication.com'],
      },
    },
  }),
);

// API レート制限（CPU 高負荷なパズル生成を保護）
const puzzleRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

app.use(express.static(path.join(__dirname, '..', 'public')));

// パズル生成API
app.get('/api/puzzle', puzzleRateLimiter, (req, res) => {
  const difficulty = req.query.difficulty || 'medium';
  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({ error: 'Invalid difficulty. Use: easy, medium, hard' });
  }
  try {
    const result = generatePuzzle(difficulty);
    return res.json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Puzzle generation error:', err);
    return res.status(500).json({ error: 'Failed to generate puzzle. Please try again.' });
  }
});

// 未定義APIルートの404ハンドラ
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// グローバルエラーハンドラ
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Only start server if this file is run directly (not imported for testing)
if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`ナンプレサーバー起動: http://localhost:${PORT}`);
  });
}

module.exports = app;
