(() => {
  // === i18n 翻訳システム ===
  const translations = {
    ja: {
      title: '無料で遊べるオンラインナンプレ（数独）',
      subtitle: '毎日新しいパズルに挑戦しよう',
      selectDifficulty: '難易度を選んでスタート',
      easy: '初級',
      medium: '中級',
      hard: '上級',
      easyHints: 'ヒント 36〜40',
      mediumHints: 'ヒント 28〜32',
      hardHints: 'ヒント 22〜26',
      startGame: 'ゲームスタート',
      resumeGame: '続きをプレイ',
      newGame: '新しいゲーム',
      loading: '生成中...',
      erase: '消去',
      memoOn: 'メモ: ON <kbd>M</kbd>',
      memoOff: 'メモ: OFF <kbd>M</kbd>',
      undo: '↩ 戻る',
      redo: '↪ 進む',
      confirm: '確認',
      confirmMessage: '現在のゲームを中断して新しいゲームを始めますか？',
      yes: 'はい',
      no: 'いいえ',
      cleared: 'クリア！',
      shareX: 'X でシェア',
      copyResult: '結果をコピー',
      copied: 'コピーしました！',
      playAgain: 'もう一度プレイ',
      nextDifficulty: '次の難易度',
      mistakes: 'ミス',
      difficultyLabel: '難易度',
      timeLabel: 'タイム',
      mistakesLabel: 'ミス',
      mistakesCount: '回',
      rulesTitle: 'ルール・遊び方',
      rulesContent: `
        <h3>基本ルール</h3>
        <ul>
          <li>9×9のマスに1〜9の数字を埋めます</li>
          <li><strong>横一列</strong>（行）に1〜9が一つずつ入ります</li>
          <li><strong>縦一列</strong>（列）に1〜9が一つずつ入ります</li>
          <li><strong>太線で囲まれた3×3のブロック</strong>に1〜9が一つずつ入ります</li>
        </ul>
        <h3>操作方法</h3>
        <ul>
          <li><strong>セル選択:</strong> クリック / 矢印キー / WASD</li>
          <li><strong>数字入力:</strong> 数字キー(1-9) / 画面の数字ボタン</li>
          <li><strong>消去:</strong> 0 / Backspace / Delete / 消去ボタン</li>
          <li><strong>メモモード切替:</strong> Mキー</li>
          <li><strong>元に戻す:</strong> Ctrl+Z</li>
          <li><strong>やり直し:</strong> Ctrl+Y / Ctrl+Shift+Z</li>
        </ul>
        <h3>メモ機能</h3>
        <p>メモモードをONにすると、候補数字を小さくメモできます。メモの入力は「戻る」の対象外です。</p>`,
      memoReset: 'メモ全消去',
      errorGeneration: 'パズルの生成に失敗しました。もう一度お試しください。',
      cookieMessage:
        'このサイトでは、広告の表示とアクセス解析のためにCookieを使用しています。詳しくは<a href="/privacy.html">プライバシーポリシー</a>をご覧ください。',
      cookieAccept: '同意する',
      footerName: 'ナンプレ - 無料オンライン数独パズル',
      privacyPolicy: 'プライバシーポリシー',
      breadcrumbHome: 'ナンプレ',
      aboutTitle: 'ナンプレ（数独）とは',
      aboutText1:
        'ナンプレ（数独）は、世界中で愛されるロジックパズルです。9×9のマスに1〜9の数字を、各行・各列・各3×3ブロックで重複しないように配置します。数学の知識は不要で、論理的思考力だけで解くことができます。',
      aboutText2:
        'このサイトでは、毎回ランダムに生成される唯一解のパズルを楽しめます。初級・中級・上級の3段階の難易度から選べ、メモ機能やUndo/Redo機能も搭載。スマートフォン・タブレット・パソコン対応で、いつでもどこでも無料でプレイできます。',
      tipsTitle: 'ナンプレ攻略のコツ',
      tipsContent: `
        <div class="tip-item">
          <h3>1. ヒントが多い場所から始める</h3>
          <p>最初にヒント数字が多い行・列・ブロックを探しましょう。空きマスが少ないほど、入る数字が絞りやすくなります。</p>
        </div>
        <div class="tip-item">
          <h3>2. メモ機能を活用する</h3>
          <p>候補となる数字をメモしておくと、論理的に絞り込みやすくなります。メモモードに切り替えて候補を記録しましょう。</p>
        </div>
        <div class="tip-item">
          <h3>3. 消去法（ネイキッドシングル）</h3>
          <p>あるマスに入る候補が1つだけなら、それが正解です。行・列・ブロックの既存の数字を確認して候補を絞りましょう。</p>
        </div>
        <div class="tip-item">
          <h3>4. 隠れたシングル（ヒドゥンシングル）</h3>
          <p>あるブロック内で、特定の数字が入れるマスが1つしかない場合、そこに確定できます。</p>
        </div>`,
      faqTitle: 'よくある質問',
      faq1Q: 'ナンプレ（数独）とは何ですか？',
      faq1A: 'ナンプレ（数独）は、9×9のマスに1〜9の数字を重複しないように埋めるロジックパズルです。数学の知識は不要で、論理的思考力で解きます。世界中で「Sudoku」として親しまれています。',
      faq2Q: '無料で遊べますか？会員登録は必要ですか？',
      faq2A: '完全無料でプレイできます。会員登録もアプリのインストールも不要です。ブラウザを開くだけですぐに遊べます。',
      faq3Q: '難易度はどのように違いますか？',
      faq3A: '初級（ヒント36〜40個）は初めての方向け、中級（ヒント28〜32個）は慣れた方向け、上級（ヒント22〜26個）は高度なテクニックが必要です。',
      faq4Q: 'スマートフォンでも遊べますか？',
      faq4A: 'はい、スマートフォン・タブレット・パソコンすべてに対応したレスポンシブデザインです。タッチ操作でも快適にプレイできます。',
      faq5Q: 'ゲームの途中でやめても大丈夫ですか？',
      faq5A: 'はい、ゲームの進行状況はブラウザに自動保存されます。次回アクセス時に「続きをプレイ」ボタンから再開できます。',
      faq6Q: 'ナンプレにはどんな効果がありますか？',
      faq6A: 'ナンプレは論理的思考力・集中力・記憶力の向上に効果があるとされています。脳トレとしても世界中で愛用されています。',
      diffPageTitle: '',
      diffPageContent: '',
      otherDifficulties: '他の難易度：',
      easyLink: '初級',
      mediumLink: '中級',
      hardLink: '上級',
      shareText: (diff, time, miss) =>
        `ナンプレ（${diff}）を${time}でクリア！ミス${miss}回\n#ナンプレ #数独 #Sudoku\nhttps://nanpure.meg4ne.net`,
    },
    en: {
      title: 'Free Online Nanpure (Sudoku) Puzzle',
      subtitle: 'Challenge a new puzzle every day',
      selectDifficulty: 'Select Difficulty & Start',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      easyHints: 'Hints 36-40',
      mediumHints: 'Hints 28-32',
      hardHints: 'Hints 22-26',
      startGame: 'Start Game',
      resumeGame: 'Resume Game',
      newGame: 'New Game',
      loading: 'Generating...',
      erase: 'Erase',
      memoOn: 'Notes: ON <kbd>M</kbd>',
      memoOff: 'Notes: OFF <kbd>M</kbd>',
      undo: '↩ Undo',
      redo: '↪ Redo',
      confirm: 'Confirm',
      confirmMessage: 'Abandon current game and start a new one?',
      yes: 'Yes',
      no: 'No',
      cleared: 'Complete!',
      shareX: 'Share on X',
      copyResult: 'Copy Result',
      copied: 'Copied!',
      playAgain: 'Play Again',
      nextDifficulty: 'Next Difficulty',
      mistakes: 'Mistakes',
      difficultyLabel: 'Difficulty',
      timeLabel: 'Time',
      mistakesLabel: 'Mistakes',
      mistakesCount: '',
      rulesTitle: 'Rules & How to Play',
      rulesContent: `
        <h3>Basic Rules</h3>
        <ul>
          <li>Fill the 9×9 grid with numbers 1-9</li>
          <li>Each <strong>row</strong> must contain 1-9 exactly once</li>
          <li>Each <strong>column</strong> must contain 1-9 exactly once</li>
          <li>Each <strong>3×3 box</strong> (outlined in bold) must contain 1-9 exactly once</li>
        </ul>
        <h3>Controls</h3>
        <ul>
          <li><strong>Select cell:</strong> Click / Arrow keys / WASD</li>
          <li><strong>Enter number:</strong> Number keys (1-9) / On-screen buttons</li>
          <li><strong>Erase:</strong> 0 / Backspace / Delete / Erase button</li>
          <li><strong>Toggle notes:</strong> M key</li>
          <li><strong>Undo:</strong> Ctrl+Z</li>
          <li><strong>Redo:</strong> Ctrl+Y / Ctrl+Shift+Z</li>
        </ul>
        <h3>Notes Mode</h3>
        <p>Turn on Notes mode to pencil in candidate numbers. Note entries are not tracked by undo.</p>`,
      memoReset: 'Clear All Notes',
      errorGeneration: 'Failed to generate puzzle. Please try again.',
      cookieMessage:
        'This site uses cookies for advertising and analytics. See our <a href="/privacy.html">Privacy Policy</a> for details.',
      cookieAccept: 'Accept',
      footerName: 'Nanpure - Free Online Sudoku Puzzle',
      privacyPolicy: 'Privacy Policy',
      breadcrumbHome: 'Nanpure',
      aboutTitle: 'What is Nanpure (Sudoku)?',
      aboutText1:
        'Nanpure (Sudoku) is a logic puzzle loved worldwide. Place numbers 1-9 in a 9×9 grid so that each row, column, and 3×3 block contains each number exactly once. No math knowledge is needed—just logical thinking.',
      aboutText2:
        'This site generates unique puzzles with guaranteed single solutions every time. Choose from 3 difficulty levels, use the notes feature and undo/redo. Fully responsive for smartphones, tablets, and PCs—play free anytime, anywhere.',
      tipsTitle: 'Sudoku Tips & Strategies',
      tipsContent: `
        <div class="tip-item">
          <h3>1. Start Where Hints Are Dense</h3>
          <p>Look for rows, columns, or blocks with the most given numbers. Fewer empty cells means fewer possible candidates to consider.</p>
        </div>
        <div class="tip-item">
          <h3>2. Use the Notes Feature</h3>
          <p>Pencil in candidate numbers using Notes mode. This makes it easier to logically narrow down possibilities and spot patterns.</p>
        </div>
        <div class="tip-item">
          <h3>3. Naked Singles</h3>
          <p>If a cell has only one possible candidate after checking its row, column, and block, that candidate is the answer.</p>
        </div>
        <div class="tip-item">
          <h3>4. Hidden Singles</h3>
          <p>If a number can only go in one cell within a block, row, or column, it must go there—even if that cell has other candidates.</p>
        </div>`,
      faqTitle: 'Frequently Asked Questions',
      faq1Q: 'What is Nanpure (Sudoku)?',
      faq1A: 'Nanpure (Sudoku) is a logic puzzle where you fill a 9×9 grid with numbers 1-9 without repeating in any row, column, or 3×3 block. No math needed—just logic. Known worldwide as "Sudoku".',
      faq2Q: 'Is it free? Do I need to register?',
      faq2A: 'Completely free. No registration or app installation required. Just open your browser and start playing instantly.',
      faq3Q: 'How do the difficulty levels differ?',
      faq3A: 'Easy (36-40 hints) is for beginners, Medium (28-32 hints) for experienced players, and Hard (22-26 hints) requires advanced techniques.',
      faq4Q: 'Can I play on my phone?',
      faq4A: 'Yes, the game features a fully responsive design optimized for smartphones, tablets, and desktop computers. Touch controls work perfectly.',
      faq5Q: 'Can I save my progress?',
      faq5A: 'Yes, your game progress is automatically saved in your browser. Resume anytime with the "Resume Game" button on your next visit.',
      faq6Q: 'What are the benefits of playing Nanpure?',
      faq6A: 'Nanpure helps improve logical thinking, concentration, and memory. It\'s enjoyed worldwide as an effective brain training exercise.',
      diffPageTitle: '',
      diffPageContent: '',
      otherDifficulties: 'Other difficulties:',
      easyLink: 'Easy',
      mediumLink: 'Medium',
      hardLink: 'Hard',
      shareText: (diff, time, miss) =>
        `Nanpure Sudoku (${diff}) cleared in ${time}! Mistakes: ${miss}\n#Nanpure #Sudoku\nhttps://nanpure.meg4ne.net`,
    },
  };

  // === 言語管理 ===
  // URLベースの言語を優先（/en/ ページは data-lang="en" がbodyに付与される）
  const pageLang = document.body.dataset.lang || null;
  let currentLang = pageLang
    || localStorage.getItem('nanpure-lang')
    || ((navigator.language || navigator.userLanguage || 'ja').startsWith('ja') ? 'ja' : 'en');
  let t = translations[currentLang];
  document.documentElement.lang = currentLang;

  // === ダークモード管理 ===
  function getPreferredTheme() {
    const saved = localStorage.getItem('nanpure-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nanpure-theme', theme);
    // テーマトグルボタンのアイコン更新
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    // meta theme-color を動的に更新
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#1a1a2e' : '#1a1a1a');
    }
  }

  function setupThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        trackEvent('theme_toggle', { theme: next });
      });
    }
    // OS設定の変更を監視
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // ユーザーが手動設定していない場合のみ追従
      if (!localStorage.getItem('nanpure-theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // 初期テーマ適用（FOUC防止: なるべく早く実行）
  applyTheme(getPreferredTheme());

  // === Google Analytics 4 ===
  function initGA4() {
    // GA4測定IDを設定してください
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
    if (GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return; // 未設定時はスキップ

    // gtag.js を非同期読み込み
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: true,
      cookie_flags: 'SameSite=None;Secure',
    });
  }

  // GA4カスタムイベント送信
  function trackEvent(eventName, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        // eslint-disable-next-line no-param-reassign
        el.textContent = t[key];
      }
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (t[key] !== undefined) {
        // eslint-disable-next-line no-param-reassign
        el.innerHTML = t[key];
      }
    });
  }

  function toggleLanguage() {
    // URLベースで言語を切り替え（SEO対応: 各言語に固有のURLを持たせる）
    const currentPath = window.location.pathname;
    const isOnEnglishPage = currentPath.startsWith('/en');

    if (isOnEnglishPage) {
      // 英語→日本語: /en/ プレフィックスを除去
      const jaPath = currentPath.replace(/^\/en\/?/, '/') || '/';
      window.location.href = jaPath;
    } else {
      // 日本語→英語: /en/ プレフィックスを追加
      const enPath = currentPath === '/' ? '/en/' : '/en' + currentPath;
      window.location.href = enPath;
    }
  }

  function updateLangButton() {
    const btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.textContent = currentLang === 'ja' ? 'EN' : 'JP';
    }
  }

  function getDifficultyLabel(diff) {
    return t[diff] || diff;
  }

  // === 状態 ===
  let puzzle = [];
  let solution = [];
  let board = [];
  let memos = [];
  let selected = null;
  // URLまたはbody属性から初期難易度を取得
  let difficulty = document.body.dataset.difficulty || 'medium';
  let memoMode = false;
  let mistakes = 0;
  let timerInterval = null;
  let seconds = 0;
  let gameActive = false;

  // Undo/Redo 履歴
  let history = [];
  let historyIndex = -1;

  // DOM
  const startScreen = document.getElementById('start-screen');
  const gameScreen = document.getElementById('game-screen');
  const boardEl = document.getElementById('board');
  const loadingEl = document.getElementById('loading');
  const timerEl = document.getElementById('timer');
  const mistakesEl = document.getElementById('mistakes');
  const memoToggleBtn = document.getElementById('memo-toggle');
  const completeModal = document.getElementById('complete-modal');
  const completeTime = document.getElementById('complete-time');
  const completeMistakes = document.getElementById('complete-mistakes');
  const completeDifficulty = document.getElementById('complete-difficulty');
  const confirmModal = document.getElementById('confirm-modal');

  // === ゲーム永続化 ===
  function saveGameToStorage() {
    if (!gameActive) return;
    try {
      const data = {
        puzzle,
        solution,
        board,
        memos: memos.map((r) => r.map((s) => [...s])),
        mistakes,
        seconds,
        difficulty,
      };
      localStorage.setItem('nanpure-game', JSON.stringify(data));
    } catch (e) {
      // ストレージエラーは無視
    }
  }

  function loadGameFromStorage() {
    try {
      const raw = localStorage.getItem('nanpure-game');
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data.puzzle || !data.solution || !data.board || !data.memos) return null;
      data.memos = data.memos.map((r) => r.map((s) => new Set(s)));
      return data;
    } catch {
      return null;
    }
  }

  function clearGameStorage() {
    localStorage.removeItem('nanpure-game');
  }

  // 初期化
  function init() {
    applyTranslations();
    updateLangButton();
    setupLangToggle();
    setupThemeToggle();
    setupCookieConsent();
    setupStartScreen();
    setupDifficultyButtons();
    setupNumpad();
    setupMemoToggle();
    setupMemoReset();
    setupUndoRedo();
    setupKeyboard();
    setupConfirmDialog();
    setupShareButtons();

    document.getElementById('new-game').addEventListener('click', requestNewGame);
    document.getElementById('play-again').addEventListener('click', () => {
      completeModal.classList.add('hidden');
      startNewGame();
    });
    setupCompleteDifficultyButtons();

    // 保存済みゲームがあれば続きボタンを表示
    const savedGame = loadGameFromStorage();
    if (savedGame) {
      const resumeBtn = document.getElementById('resume-game');
      if (resumeBtn) resumeBtn.classList.remove('hidden');
    }
  }

  // === クリアモーダル内の難易度選択 ===
  function setupCompleteDifficultyButtons() {
    document.querySelectorAll('.complete-diff-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.complete-diff-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        difficulty = btn.dataset.diff;
        syncDifficultyButtons();
      });
    });
  }

  function syncCompleteDifficultyButtons() {
    document.querySelectorAll('.complete-diff-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.diff === difficulty);
    });
  }

  // === 言語トグル ===
  function setupLangToggle() {
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.addEventListener('click', toggleLanguage);
  }

  // === Cookie同意 & AdSense & GA4 ===
  function setupCookieConsent() {
    const consentBanner = document.getElementById('cookie-consent');
    const acceptBtn = document.getElementById('cookie-accept');

    if (localStorage.getItem('cookie-consent') === 'accepted') {
      loadAdSense();
      initGA4();
      return;
    }

    consentBanner.classList.remove('hidden');
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'accepted');
      consentBanner.classList.add('hidden');
      loadAdSense();
      initGA4();
    });
  }

  function loadAdSense() {
    const script = document.getElementById('adsense-script');
    if (script && !script.src) {
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    }
    try {
      document.querySelectorAll('.adsbygoogle').forEach(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      });
    } catch (e) {
      // AdSense未設定時は無視
    }
  }

  // === スタート画面 ===
  function setupStartScreen() {
    document.querySelectorAll('.start-diff-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.start-diff-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        difficulty = btn.dataset.diff;
        syncDifficultyButtons();
      });
    });

    document.getElementById('start-game').addEventListener('click', () => {
      startScreen.classList.add('hidden');
      gameScreen.classList.remove('hidden');
      startNewGame();
    });

    const resumeBtn = document.getElementById('resume-game');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        const savedData = loadGameFromStorage();
        if (savedData) {
          startScreen.classList.add('hidden');
          gameScreen.classList.remove('hidden');
          resumeSavedGame(savedData);
        }
      });
    }
  }

  function syncDifficultyButtons() {
    document.querySelectorAll('.diff-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.diff === difficulty);
    });
    document.querySelectorAll('.start-diff-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.diff === difficulty);
    });
  }

  // === 保存済みゲームの復元 ===
  function resumeSavedGame(savedData) {
    puzzle = savedData.puzzle;
    solution = savedData.solution;
    board = savedData.board;
    memos = savedData.memos;
    mistakes = savedData.mistakes;
    seconds = savedData.seconds || 0;
    difficulty = savedData.difficulty || 'medium';
    memoMode = false;
    selected = null;

    syncDifficultyButtons();
    updateMemoButtonText();
    updateMistakes();
    updateTimer();

    // 復元時は現在の状態を初期履歴として設定（undoは効かない）
    history = [
      {
        board: board.map((r) => [...r]),
      },
    ];
    historyIndex = 0;

    renderBoard();
    gameActive = true;

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      seconds++;
      updateTimer();
      if (seconds % 30 === 0) saveGameToStorage();
    }, 1000);
  }

  // 難易度ボタン（ゲーム画面内）
  function setupDifficultyButtons() {
    document.querySelectorAll('.diff-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        difficulty = btn.dataset.diff;
        syncDifficultyButtons();
      });
    });
  }

  // 確認ダイアログ
  function setupConfirmDialog() {
    document.getElementById('confirm-no').addEventListener('click', () => {
      confirmModal.classList.add('hidden');
    });
    document.getElementById('confirm-yes').addEventListener('click', () => {
      confirmModal.classList.add('hidden');
      startNewGame();
    });
  }

  function requestNewGame() {
    if (gameActive) {
      confirmModal.classList.remove('hidden');
    } else {
      startNewGame();
    }
  }

  // 数字パッド
  function setupNumpad() {
    document.querySelectorAll('.num-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!gameActive || !selected) return;
        const num = parseInt(btn.dataset.num, 10);
        inputNumber(num);
      });
    });
  }

  // メモモードトグル
  function setupMemoToggle() {
    memoToggleBtn.addEventListener('click', toggleMemoMode);
  }

  function toggleMemoMode() {
    memoMode = !memoMode;
    updateMemoButtonText();
  }

  function updateMemoButtonText() {
    memoToggleBtn.innerHTML = memoMode ? t.memoOn : t.memoOff;
    memoToggleBtn.classList.toggle('active', memoMode);
  }

  // メモ全消去
  function setupMemoReset() {
    document.getElementById('memo-reset').addEventListener('click', resetAllMemos);
  }

  function resetAllMemos() {
    if (!gameActive) return;
    memos = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set()));
    renderBoard();
    saveGameToStorage();
  }

  // Undo/Redo ボタン
  function setupUndoRedo() {
    document.getElementById('undo-btn').addEventListener('click', undo);
    document.getElementById('redo-btn').addEventListener('click', redo);
  }

  // キーボード入力
  function setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (gameActive) {
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
          e.preventDefault();
          undo();
          return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
          e.preventDefault();
          redo();
          return;
        }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
          e.preventDefault();
          redo();
          return;
        }
      }

      if (!gameActive) return;

      if (e.key >= '1' && e.key <= '9') {
        if (selected) inputNumber(parseInt(e.key, 10));
        return;
      }
      if (e.key === '0' || e.key === 'Backspace' || e.key === 'Delete') {
        if (selected) inputNumber(0);
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        if (!e.ctrlKey && !e.metaKey) {
          toggleMemoMode();
          return;
        }
      }

      if (selected) {
        let moved = false;
        switch (e.key) {
          case 'ArrowUp':
            selectCell(Math.max(0, selected.row - 1), selected.col);
            moved = true;
            break;
          case 'ArrowDown':
            selectCell(Math.min(8, selected.row + 1), selected.col);
            moved = true;
            break;
          case 'ArrowLeft':
            selectCell(selected.row, Math.max(0, selected.col - 1));
            moved = true;
            break;
          case 'ArrowRight':
            selectCell(selected.row, Math.min(8, selected.col + 1));
            moved = true;
            break;
        }
        if (moved) {
          e.preventDefault();
          return;
        }

        const lower = e.key.toLowerCase();
        if (!e.ctrlKey && !e.metaKey) {
          switch (lower) {
            case 'w':
              e.preventDefault();
              selectCell(Math.max(0, selected.row - 1), selected.col);
              return;
            case 's':
              e.preventDefault();
              selectCell(Math.min(8, selected.row + 1), selected.col);
              return;
            case 'a':
              e.preventDefault();
              selectCell(selected.row, Math.max(0, selected.col - 1));
              return;
            case 'd':
              e.preventDefault();
              selectCell(selected.row, Math.min(8, selected.col + 1));
              return;
          }
        }

        if (e.ctrlKey || e.metaKey) {
          switch (lower) {
            case 'p':
              e.preventDefault();
              selectCell(Math.max(0, selected.row - 1), selected.col);
              return;
            case 'n':
              e.preventDefault();
              selectCell(Math.min(8, selected.row + 1), selected.col);
              return;
            case 'b':
              e.preventDefault();
              selectCell(selected.row, Math.max(0, selected.col - 1));
              return;
            case 'f':
              e.preventDefault();
              selectCell(selected.row, Math.min(8, selected.col + 1));
              return;
          }
        }
      }
    });
  }

  // === Undo/Redo ===
  // 変更を適用した「後」に状態をプッシュする
  // 注: mistakesは履歴に含めない（ゲーム的に一度のミスは取り消せない）
  function pushState() {
    history = history.slice(0, historyIndex + 1);
    history.push({
      board: board.map((r) => [...r]),
    });
    historyIndex = history.length - 1;
  }

  function restoreState(state) {
    board = state.board.map((r) => [...r]);
    // memos, mistakesは復元しない（undo対象外）
    renderBoard();
  }

  function undo() {
    if (historyIndex <= 0) return;
    historyIndex--;
    restoreState(history[historyIndex]);
    saveGameToStorage();
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    historyIndex++;
    restoreState(history[historyIndex]);
    saveGameToStorage();
  }

  // === エラー表示 ===
  function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-toast';
    errorEl.textContent = message;
    errorEl.setAttribute('role', 'alert');
    document.body.appendChild(errorEl);
    setTimeout(() => {
      errorEl.classList.add('fade-out');
      setTimeout(() => errorEl.remove(), 300);
    }, 4000);
  }

  // === 新しいゲーム開始 ===
  async function startNewGame() {
    clearGameStorage();
    loadingEl.classList.remove('hidden');
    gameActive = false;
    selected = null;
    mistakes = 0;
    seconds = 0;
    memoMode = false;
    history = [];
    historyIndex = -1;
    updateMemoButtonText();
    updateTimer();
    updateMistakes();

    if (timerInterval) clearInterval(timerInterval);

    try {
      const res = await fetch(`/api/puzzle?difficulty=${difficulty}`);
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      const data = await res.json();
      puzzle = data.puzzle;
      solution = data.solution;
      board = puzzle.map((row) => [...row]);
      memos = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set()));

      // 初期状態を履歴の先頭として保存
      history = [
        {
          board: board.map((r) => [...r]),
          memos: memos.map((r) => r.map((s) => new Set(s))),
        },
      ];
      historyIndex = 0;

      renderBoard();
      gameActive = true;
      saveGameToStorage();

      trackEvent('game_start', { difficulty });

      timerInterval = setInterval(() => {
        seconds++;
        updateTimer();
        if (seconds % 30 === 0) saveGameToStorage();
      }, 1000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Puzzle fetch error:', err);
      showError(t.errorGeneration);
    } finally {
      loadingEl.classList.add('hidden');
    }
  }

  // === 盤面描画 ===
  function renderBoard() {
    // DOM を確実にクリア（innerHTML = '' はブラウザにより暗黙 tbody が残る場合がある）
    while (boardEl.firstChild) {
      boardEl.removeChild(boardEl.firstChild);
    }
    // 明示的に <tbody> を作成し、全行をその中に配置する
    const tbody = document.createElement('tbody');
    for (let r = 0; r < 9; r++) {
      const tr = document.createElement('tr');
      tr.setAttribute('role', 'row');
      for (let c = 0; c < 9; c++) {
        const td = document.createElement('td');
        td.dataset.row = r;
        td.dataset.col = c;
        td.setAttribute('role', 'gridcell');
        td.setAttribute('tabindex', '-1');
        td.setAttribute('aria-label', `Row ${r + 1}, Column ${c + 1}`);

        if (puzzle[r][c] !== 0) {
          td.textContent = puzzle[r][c];
          td.classList.add('given');
          td.setAttribute('aria-readonly', 'true');
        } else if (board[r][c] !== 0) {
          td.textContent = board[r][c];
          td.classList.add('user-input');
          if (board[r][c] !== solution[r][c]) {
            td.classList.add('error');
            td.setAttribute('aria-invalid', 'true');
          }
        } else if (memos[r][c].size > 0) {
          const memoGrid = document.createElement('div');
          memoGrid.classList.add('memo-grid');
          for (let n = 1; n <= 9; n++) {
            const span = document.createElement('span');
            span.textContent = memos[r][c].has(n) ? n : '';
            memoGrid.appendChild(span);
          }
          td.appendChild(memoGrid);
        }

        td.addEventListener('click', () => selectCell(r, c));
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    boardEl.appendChild(tbody);
    updateHighlight();
    updateNumpadState();
  }

  // セル選択
  function selectCell(row, col) {
    selected = { row, col };
    updateHighlight();
  }

  // ハイライト更新
  function updateHighlight() {
    const cells = boardEl.querySelectorAll('td');
    cells.forEach((td) => {
      td.classList.remove('selected', 'highlighted', 'same-number');
      const r = parseInt(td.dataset.row, 10);
      const c = parseInt(td.dataset.col, 10);

      if (selected) {
        if (r === selected.row && c === selected.col) {
          td.classList.add('selected');
        } else if (r === selected.row || c === selected.col) {
          td.classList.add('highlighted');
        } else {
          const boxRow = Math.floor(selected.row / 3) * 3;
          const boxCol = Math.floor(selected.col / 3) * 3;
          if (r >= boxRow && r < boxRow + 3 && c >= boxCol && c < boxCol + 3) {
            td.classList.add('highlighted');
          }
        }

        const selectedVal = board[selected.row][selected.col];
        if (selectedVal !== 0 && board[r][c] === selectedVal) {
          td.classList.add('same-number');
        }
      }
    });
  }

  // === 数字入力 ===
  function inputNumber(num) {
    if (!selected) return;
    const { row, col } = selected;

    if (puzzle[row][col] !== 0) return;

    if (memoMode && num !== 0) {
      // メモモード: 直接適用、undo履歴には記録しない
      if (memos[row][col].has(num)) {
        memos[row][col].delete(num);
      } else {
        memos[row][col].add(num);
      }
      board[row][col] = 0;
      renderBoard();
      saveGameToStorage();
      return;
    }

    // 通常入力: 変更を適用してからpushState
    if (num === 0) {
      board[row][col] = 0;
      memos[row][col].clear();
    } else {
      board[row][col] = num;
      memos[row][col].clear();

      if (num !== solution[row][col]) {
        mistakes++;
        updateMistakes();
      } else {
        clearMemosRelated(row, col, num);
      }
    }

    pushState();
    renderBoard();
    saveGameToStorage();
    checkCompletion();
  }

  // 関連セルのメモをクリア
  function clearMemosRelated(row, col, num) {
    for (let i = 0; i < 9; i++) {
      memos[row][i].delete(num);
      memos[i][col].delete(num);
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        memos[r][c].delete(num);
      }
    }
  }

  // 数字パッドの状態更新
  function updateNumpadState() {
    for (let n = 1; n <= 9; n++) {
      let count = 0;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c] === n && board[r][c] === solution[r][c]) count++;
        }
      }
      const btn = document.querySelector(`.num-btn[data-num="${n}"]`);
      btn.classList.toggle('completed', count >= 9);
    }
  }

  // クリア判定
  function checkCompletion() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== solution[r][c]) return;
      }
    }

    gameActive = false;
    if (timerInterval) clearInterval(timerInterval);
    clearGameStorage();

    completeDifficulty.textContent = `${t.difficultyLabel}: ${getDifficultyLabel(difficulty)}`;
    completeTime.textContent = `${t.timeLabel}: ${formatTime(seconds)}`;
    completeMistakes.textContent = `${t.mistakesLabel}: ${mistakes}${t.mistakesCount}`;
    syncCompleteDifficultyButtons();
    completeModal.classList.remove('hidden');

    trackEvent('game_complete', {
      difficulty,
      time_seconds: seconds,
      mistakes,
    });
  }

  // シェア機能
  function setupShareButtons() {
    document.getElementById('share-x').addEventListener('click', shareToX);
    document.getElementById('share-copy').addEventListener('click', copyResult);
  }

  function getShareText() {
    const diffLabel = getDifficultyLabel(difficulty);
    const time = formatTime(seconds);
    return t.shareText(diffLabel, time, mistakes);
  }

  function shareToX() {
    const text = encodeURIComponent(getShareText());
    window.open(`https://x.com/intent/tweet?text=${text}`, '_blank', 'noopener,noreferrer');
    trackEvent('share', { method: 'x', difficulty });
  }

  function copyResult() {
    const text = getShareText();
    const btn = document.getElementById('share-copy');
    const showCopied = () => {
      const original = btn.textContent;
      btn.textContent = t.copied;
      trackEvent('share', { method: 'copy', difficulty });
      setTimeout(() => {
        btn.textContent = original;
      }, 2000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showCopied).catch(() => {
        fallbackCopy(text, showCopied);
      });
    } else {
      fallbackCopy(text, showCopied);
    }
  }

  function fallbackCopy(text, onSuccess) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      onSuccess();
    } catch (e) {
      // コピー失敗時は何もしない
    }
    document.body.removeChild(textarea);
  }

  // タイマー
  function updateTimer() {
    timerEl.textContent = formatTime(seconds);
  }

  function formatTime(s) {
    const min = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }

  function updateMistakes() {
    mistakesEl.textContent = `${t.mistakes}: ${mistakes}`;
  }

  init();
})();
