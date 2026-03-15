const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { generatePuzzle } = require('./sudoku');

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ビルド済みアセットのマニフェスト読み込み
let assetManifest = {};
const manifestPath = path.join(__dirname, '..', 'dist', 'manifest.json');
if (IS_PRODUCTION && fs.existsSync(manifestPath)) {
  assetManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

// gzip圧縮
app.use(compression());

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
          'https://www.googletagmanager.com',
          'https://www.google-analytics.com',
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: [
          "'self'",
          'data:',
          'https:',
          'https://www.google-analytics.com',
          'https://www.googletagmanager.com',
        ],
        frameSrc: ['https://googleads.g.doubleclick.net', 'https://tpc.googlesyndication.com'],
        connectSrc: [
          "'self'",
          'https://pagead2.googlesyndication.com',
          'https://www.google-analytics.com',
          'https://www.googletagmanager.com',
          'https://*.google-analytics.com',
          'https://*.analytics.google.com',
        ],
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

// 本番環境: dist/からminifyされたアセットを配信（長期キャッシュ）
if (IS_PRODUCTION && fs.existsSync(path.join(__dirname, '..', 'dist'))) {
  app.use(
    '/assets',
    express.static(path.join(__dirname, '..', 'dist'), {
      maxAge: '1y',
      immutable: true,
      setHeaders: (res) => {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      },
    }),
  );
}

// 日本語ホームページ（テンプレート経由で本番アセットを適用）
app.get('/', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.type('html').send(getIndexTemplate());
});

// 静的ファイルのキャッシュ設定
app.use(
  express.static(path.join(__dirname, '..', 'public'), {
    maxAge: '7d',
    setHeaders: (res, filePath) => {
      // HTMLは短いキャッシュ（コンテンツ更新を早く反映）
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
      // CSS/JSは長めのキャッシュ
      if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
        res.setHeader('Cache-Control', 'public, max-age=604800');
      }
      // 画像は長めのキャッシュ
      if (filePath.match(/\.(png|jpg|jpeg|gif|ico|svg|webp)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=2592000');
      }
    },
  }),
);

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

// === 難易度別ランディングページ ===
const DIFFICULTY_META = {
  easy: {
    ja: {
      title: 'ナンプレ 初級 - 無料で遊べる簡単な数独パズル | Easy Sudoku',
      description: 'ナンプレ初級（Easy）。ヒント36〜40個で初心者にもやさしい数独パズル。無料でブラウザからすぐに遊べます。',
      h1: 'ナンプレ 初級',
      subtitle: '初心者向け・無料オンライン数独パズル',
      keywords: 'ナンプレ 初級,数独 簡単,Sudoku easy,初心者,ナンプレ 入門,無料',
      content: 'ナンプレ初級は、ヒントが36〜40個と多いため、初めての方でも安心して楽しめます。基本的な消去法（ネイキッドシングル）だけで解ける問題がほとんどです。まずは初級で数独の基本ルールに慣れましょう。',
    },
    en: {
      title: 'Nanpure Easy - Free Beginner Sudoku Puzzle',
      description: 'Play easy Sudoku puzzles online for free. 36-40 hints make it perfect for beginners. No registration required.',
      h1: 'Nanpure Easy',
      subtitle: 'Beginner-friendly Free Online Sudoku',
      keywords: 'easy sudoku,beginner sudoku,simple sudoku,free sudoku easy',
      content: 'Easy mode features 36-40 hints, making it perfect for beginners. Most puzzles can be solved using basic naked singles technique. Start here to learn the fundamentals of Sudoku.',
    },
  },
  medium: {
    ja: {
      title: 'ナンプレ 中級 - 無料で遊べるオンライン数独パズル | Medium Sudoku',
      description: 'ナンプレ中級（Medium）。ヒント28〜32個で程よい難しさの数独パズル。無料でブラウザからすぐに遊べます。',
      h1: 'ナンプレ 中級',
      subtitle: '程よい難しさ・無料オンライン数独パズル',
      keywords: 'ナンプレ 中級,数独 中級,Sudoku medium,ナンプレ 普通,無料',
      content: 'ナンプレ中級は、ヒントが28〜32個。ネイキッドシングルに加え、ヒドゥンシングルなどのテクニックも必要になります。初級に慣れた方におすすめの、程よいチャレンジが楽しめる難易度です。',
    },
    en: {
      title: 'Nanpure Medium - Free Intermediate Sudoku Puzzle',
      description: 'Play medium difficulty Sudoku puzzles online for free. 28-32 hints for a balanced challenge. No registration required.',
      h1: 'Nanpure Medium',
      subtitle: 'Balanced Challenge - Free Online Sudoku',
      keywords: 'medium sudoku,intermediate sudoku,sudoku puzzle,free sudoku',
      content: 'Medium mode features 28-32 hints. You\'ll need techniques beyond naked singles, including hidden singles. A perfect step up from easy mode for a balanced challenge.',
    },
  },
  hard: {
    ja: {
      title: 'ナンプレ 上級 - 無料で遊べる難しい数独パズル | Hard Sudoku',
      description: 'ナンプレ上級（Hard）。ヒント22〜26個の高難度数独パズル。上級テクニックが必要。無料でブラウザからすぐに遊べます。',
      h1: 'ナンプレ 上級',
      subtitle: '高難度・無料オンライン数独パズル',
      keywords: 'ナンプレ 上級,数独 難しい,Sudoku hard,上級者向け,ナンプレ 上級者,無料',
      content: 'ナンプレ上級は、ヒントが22〜26個と少なく、高度な解法テクニックが求められます。ネイキッドペアやポインティングペアなどの応用テクニックを駆使して解く、やりがいのある問題です。',
    },
    en: {
      title: 'Nanpure Hard - Free Expert Sudoku Puzzle',
      description: 'Play hard Sudoku puzzles online for free. Only 22-26 hints for expert players. Advanced techniques required.',
      h1: 'Nanpure Hard',
      subtitle: 'Expert Level - Free Online Sudoku',
      keywords: 'hard sudoku,expert sudoku,difficult sudoku,advanced sudoku,free',
      content: 'Hard mode features only 22-26 hints, requiring advanced techniques like naked pairs and pointing pairs. A rewarding challenge for experienced Sudoku players.',
    },
  },
};

// 英語ホームページ用メタデータ
const ENGLISH_HOME_META = {
  title: 'Nanpure - Free Online Sudoku Puzzle | Play Sudoku Free',
  description: 'Play free Sudoku puzzles online with 3 difficulty levels. Randomly generated unique puzzles every time. No registration required. Works on all devices.',
  keywords: 'sudoku,nanpure,number place,puzzle,free,online,brain training,logic puzzle',
};

// index.html テンプレートをキャッシュ
let indexTemplate = null;
function getIndexTemplate() {
  if (!indexTemplate) {
    let html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');

    // 本番環境: minifyされたアセットに差し替え
    if (IS_PRODUCTION && assetManifest['style.css']) {
      html = html.replace(
        '<link rel="stylesheet" href="style.css" />',
        `<link rel="stylesheet" href="/assets/${assetManifest['style.css']}" />`,
      );
    }
    if (IS_PRODUCTION && assetManifest['app.js']) {
      html = html.replace(
        '<script src="app.js"></script>',
        `<script src="/assets/${assetManifest['app.js']}"></script>`,
      );
    }

    indexTemplate = html;
  }
  return indexTemplate;
}

// hreflang タグを正しいURLに更新
function applyHreflang(page, diff) {
  const baseUrl = 'https://nanpure.meg4ne.net';
  const jaPath = diff ? `/${diff}` : '/';
  const enPath = diff ? `/en/${diff}` : '/en/';

  page = page.replace(
    /<link rel="alternate" hreflang="ja" href="[^"]*"\s*\/>/,
    `<link rel="alternate" hreflang="ja" href="${baseUrl}${jaPath}" />`,
  );
  page = page.replace(
    /<link rel="alternate" hreflang="en" href="[^"]*"\s*\/>/,
    `<link rel="alternate" hreflang="en" href="${baseUrl}${enPath}" />`,
  );
  page = page.replace(
    /<link rel="alternate" hreflang="x-default" href="[^"]*"\s*\/>/,
    `<link rel="alternate" hreflang="x-default" href="${baseUrl}/" />`,
  );
  return page;
}

function generateDifficultyPage(diff, lang = 'ja') {
  const meta = DIFFICULTY_META[diff];
  const template = getIndexTemplate();
  const baseUrl = 'https://nanpure.meg4ne.net';
  const isEnglish = lang === 'en';
  const langMeta = meta[lang];
  const prefix = isEnglish ? '/en' : '';

  // JSON-LDの難易度別データ
  const homeName = isEnglish ? 'Nanpure' : 'ナンプレ';
  const breadcrumbJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeName, item: `${baseUrl}${prefix}/` },
      { '@type': 'ListItem', position: 2, name: langMeta.h1, item: `${baseUrl}${prefix}/${diff}` },
    ],
  });

  // 難易度ページ専用のSEOコンテンツ
  const difficultySection = `
        <!-- 難易度別SEOコンテンツ -->
        <section class="seo-content seo-difficulty-page" aria-label="${langMeta.h1}">
          <h2 data-i18n="diffPageTitle">${isEnglish ? `About ${langMeta.h1}` : `${langMeta.h1}について`}</h2>
          <p data-i18n="diffPageContent">${langMeta.content}</p>
          <p class="diff-page-links">
            <span data-i18n="otherDifficulties">${isEnglish ? 'Other difficulties:' : '他の難易度：'}</span>
            ${diff !== 'easy' ? `<a href="${prefix}/easy" data-i18n="easyLink">${isEnglish ? 'Easy' : '初級'}</a>` : `<strong data-i18n="easy">${isEnglish ? 'Easy' : '初級'}</strong>`}
            ${diff !== 'medium' ? `<a href="${prefix}/medium" data-i18n="mediumLink">${isEnglish ? 'Medium' : '中級'}</a>` : `<strong data-i18n="medium">${isEnglish ? 'Medium' : '中級'}</strong>`}
            ${diff !== 'hard' ? `<a href="${prefix}/hard" data-i18n="hardLink">${isEnglish ? 'Hard' : '上級'}</a>` : `<strong data-i18n="hard">${isEnglish ? 'Hard' : '上級'}</strong>`}
          </p>
        </section>`;

  let page = template;

  // 英語ページの場合: html lang属性を変更
  if (isEnglish) {
    page = page.replace('<html lang="ja">', '<html lang="en">');
  }

  // title
  page = page.replace(
    /<title>[^<]+<\/title>/,
    `<title>${langMeta.title}</title>`,
  );
  // meta description
  page = page.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${langMeta.description}" />`,
  );
  // meta keywords
  page = page.replace(
    /<meta\s+name="keywords"\s+content="[^"]*"\s*\/>/,
    `<meta name="keywords" content="${langMeta.keywords}" />`,
  );
  // canonical
  page = page.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${baseUrl}${prefix}/${diff}" />`,
  );
  // hreflang
  page = applyHreflang(page, diff);
  // og:url
  page = page.replace(
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${baseUrl}${prefix}/${diff}" />`,
  );
  // og:title
  page = page.replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${langMeta.title}" />`,
  );
  // og:description
  page = page.replace(
    /<meta property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${langMeta.description}" />`,
  );
  // og:locale (英語ページ)
  if (isEnglish) {
    page = page.replace(
      /<meta property="og:locale" content="[^"]*"\s*\/>/,
      '<meta property="og:locale" content="en_US" />',
    );
    page = page.replace(
      /<meta property="og:locale:alternate" content="[^"]*"\s*\/>/,
      '<meta property="og:locale:alternate" content="ja_JP" />',
    );
    // Twitter
    page = page.replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/>/,
      `<meta name="twitter:title" content="${langMeta.title}" />`,
    );
    page = page.replace(
      /<meta name="twitter:description"\s+content="[^"]*"\s*\/>/,
      `<meta name="twitter:description" content="${langMeta.description}" />`,
    );
  }
  // BreadcrumbList (JSON-LD)
  page = page.replace(
    /<!-- 構造化データ: BreadcrumbList -->[\s\S]*?<\/script>/,
    `<!-- 構造化データ: BreadcrumbList -->\n    <script type="application/ld+json">${breadcrumbJson}</script>`,
  );
  // 難易度ボタンのactive状態を設定
  page = page.replace(
    /(<button class="start-diff-btn)(?: active)?(" data-diff="easy")/,
    `$1${diff === 'easy' ? ' active' : ''}$2`,
  );
  page = page.replace(
    /(<button class="start-diff-btn)(?: active)?(" data-diff="medium")/,
    `$1${diff === 'medium' ? ' active' : ''}$2`,
  );
  page = page.replace(
    /(<button class="start-diff-btn)(?: active)?(" data-diff="hard")/,
    `$1${diff === 'hard' ? ' active' : ''}$2`,
  );
  // ゲーム画面のdifficultyボタンも同期
  page = page.replace(
    /(<button class="diff-btn)(?: active)?(" data-diff="easy")/,
    `$1${diff === 'easy' ? ' active' : ''}$2`,
  );
  page = page.replace(
    /(<button class="diff-btn)(?: active)?(" data-diff="medium")/,
    `$1${diff === 'medium' ? ' active' : ''}$2`,
  );
  page = page.replace(
    /(<button class="diff-btn)(?: active)?(" data-diff="hard")/,
    `$1${diff === 'hard' ? ' active' : ''}$2`,
  );
  // 難易度別SEOセクションをスタート画面のルール前に挿入
  page = page.replace(
    '<!-- ルール・遊び方 -->',
    `${difficultySection}\n\n        <!-- ルール・遊び方 -->`,
  );
  // data属性をbodyに追加
  if (isEnglish) {
    page = page.replace('<body>', `<body data-lang="en" data-difficulty="${diff}">`);
  } else {
    page = page.replace('<body>', `<body data-difficulty="${diff}">`);
  }

  return page;
}

// 英語ホームページ生成
function generateEnglishHomePage() {
  let page = getIndexTemplate();
  const baseUrl = 'https://nanpure.meg4ne.net';
  const meta = ENGLISH_HOME_META;

  // html lang
  page = page.replace('<html lang="ja">', '<html lang="en">');
  // title
  page = page.replace(
    /<title>[^<]+<\/title>/,
    `<title>${meta.title}</title>`,
  );
  // meta description
  page = page.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${meta.description}" />`,
  );
  // meta keywords
  page = page.replace(
    /<meta\s+name="keywords"\s+content="[^"]*"\s*\/>/,
    `<meta name="keywords" content="${meta.keywords}" />`,
  );
  // canonical
  page = page.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${baseUrl}/en/" />`,
  );
  // hreflang
  page = applyHreflang(page, null);
  // og:title
  page = page.replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${meta.title}" />`,
  );
  // og:description
  page = page.replace(
    /<meta property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${meta.description}" />`,
  );
  // og:url
  page = page.replace(
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${baseUrl}/en/" />`,
  );
  // og:locale
  page = page.replace(
    /<meta property="og:locale" content="[^"]*"\s*\/>/,
    '<meta property="og:locale" content="en_US" />',
  );
  page = page.replace(
    /<meta property="og:locale:alternate" content="[^"]*"\s*\/>/,
    '<meta property="og:locale:alternate" content="ja_JP" />',
  );
  // Twitter
  page = page.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${meta.title}" />`,
  );
  page = page.replace(
    /<meta name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${meta.description}" />`,
  );
  // body
  page = page.replace('<body>', '<body data-lang="en">');

  return page;
}

// 難易度別ページルーティング（日本語）
app.get('/easy', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.type('html').send(generateDifficultyPage('easy'));
});
app.get('/medium', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.type('html').send(generateDifficultyPage('medium'));
});
app.get('/hard', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.type('html').send(generateDifficultyPage('hard'));
});

// 英語ページルーティング
app.get('/en', (req, res) => {
  // strict routing off では /en と /en/ 両方マッチする
  if (req.path === '/en') {
    return res.redirect(301, '/en/');
  }
  res.set('Cache-Control', 'public, max-age=3600');
  res.type('html').send(generateEnglishHomePage());
});
app.get('/en/easy', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.type('html').send(generateDifficultyPage('easy', 'en'));
});
app.get('/en/medium', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.type('html').send(generateDifficultyPage('medium', 'en'));
});
app.get('/en/hard', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.type('html').send(generateDifficultyPage('hard', 'en'));
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

// HTML 404ページ（APIルート以外）
app.use((req, res) => {
  const notFoundPage = path.join(__dirname, '..', 'public', '404.html');
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(notFoundPage);
  } else {
    res.json({ error: 'Not found' });
  }
});

// Only start server if this file is run directly (not imported for testing)
if (require.main === module) {
  const server = app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`ナンプレサーバー起動: http://localhost:${PORT}`);
  });

  // Graceful shutdown
  const shutdown = () => {
    server.close(() => {
      process.exit(0);
    });
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

module.exports = app;
