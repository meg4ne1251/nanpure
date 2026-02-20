(() => {
  // 状態
  let puzzle = [];
  let solution = [];
  let board = []; // ユーザーの現在の盤面
  let memos = []; // メモ: memos[row][col] = Set of numbers
  let selected = null; // { row, col }
  let difficulty = 'medium';
  let memoMode = false;
  let mistakes = 0;
  let timerInterval = null;
  let seconds = 0;
  let gameActive = false;

  // DOM
  const boardEl = document.getElementById('board');
  const loadingEl = document.getElementById('loading');
  const timerEl = document.getElementById('timer');
  const mistakesEl = document.getElementById('mistakes');
  const memoToggleBtn = document.getElementById('memo-toggle');
  const completeModal = document.getElementById('complete-modal');
  const completeTime = document.getElementById('complete-time');
  const completeMistakes = document.getElementById('complete-mistakes');

  // 初期化
  function init() {
    setupDifficultyButtons();
    setupNumpad();
    setupMemoToggle();
    setupKeyboard();
    document.getElementById('new-game').addEventListener('click', newGame);
    document.getElementById('play-again').addEventListener('click', () => {
      completeModal.classList.add('hidden');
      newGame();
    });
    newGame();
  }

  // 難易度ボタン
  function setupDifficultyButtons() {
    document.querySelectorAll('.diff-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.diff-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        difficulty = btn.dataset.diff;
      });
    });
  }

  // 数字パッド
  function setupNumpad() {
    document.querySelectorAll('.num-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!gameActive || !selected) return;
        const num = parseInt(btn.dataset.num);
        inputNumber(num);
      });
    });
  }

  // メモモードトグル
  function setupMemoToggle() {
    memoToggleBtn.addEventListener('click', () => {
      memoMode = !memoMode;
      memoToggleBtn.textContent = `メモモード: ${memoMode ? 'ON' : 'OFF'}`;
      memoToggleBtn.classList.toggle('active', memoMode);
    });
  }

  // キーボード入力
  function setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (!gameActive) return;

      if (e.key >= '1' && e.key <= '9') {
        if (selected) inputNumber(parseInt(e.key));
      } else if (e.key === '0' || e.key === 'Backspace' || e.key === 'Delete') {
        if (selected) inputNumber(0);
      } else if (e.key === 'ArrowUp' && selected) {
        e.preventDefault();
        selectCell(Math.max(0, selected.row - 1), selected.col);
      } else if (e.key === 'ArrowDown' && selected) {
        e.preventDefault();
        selectCell(Math.min(8, selected.row + 1), selected.col);
      } else if (e.key === 'ArrowLeft' && selected) {
        e.preventDefault();
        selectCell(selected.row, Math.max(0, selected.col - 1));
      } else if (e.key === 'ArrowRight' && selected) {
        e.preventDefault();
        selectCell(selected.row, Math.min(8, selected.col + 1));
      } else if (e.key === 'm' || e.key === 'M') {
        memoToggleBtn.click();
      }
    });
  }

  // 新しいゲーム開始
  async function newGame() {
    loadingEl.classList.remove('hidden');
    gameActive = false;
    selected = null;
    mistakes = 0;
    seconds = 0;
    memoMode = false;
    memoToggleBtn.textContent = 'メモモード: OFF';
    memoToggleBtn.classList.remove('active');
    updateTimer();
    updateMistakes();

    if (timerInterval) clearInterval(timerInterval);

    try {
      const res = await fetch(`/api/puzzle?difficulty=${difficulty}`);
      const data = await res.json();
      puzzle = data.puzzle;
      solution = data.solution;
      board = puzzle.map((row) => [...row]);
      memos = Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => new Set())
      );

      renderBoard();
      gameActive = true;
      timerInterval = setInterval(() => {
        seconds++;
        updateTimer();
      }, 1000);
    } catch (err) {
      console.error('パズル取得エラー:', err);
    } finally {
      loadingEl.classList.add('hidden');
    }
  }

  // 盤面描画
  function renderBoard() {
    boardEl.innerHTML = '';
    for (let r = 0; r < 9; r++) {
      const tr = document.createElement('tr');
      for (let c = 0; c < 9; c++) {
        const td = document.createElement('td');
        td.dataset.row = r;
        td.dataset.col = c;

        if (puzzle[r][c] !== 0) {
          td.textContent = puzzle[r][c];
          td.classList.add('given');
        } else if (board[r][c] !== 0) {
          td.textContent = board[r][c];
          td.classList.add('user-input');
          if (board[r][c] !== solution[r][c]) {
            td.classList.add('error');
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
      boardEl.appendChild(tr);
    }
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
      const r = parseInt(td.dataset.row);
      const c = parseInt(td.dataset.col);

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

        // 同じ数字のハイライト
        const selectedVal = board[selected.row][selected.col];
        if (selectedVal !== 0 && board[r][c] === selectedVal) {
          td.classList.add('same-number');
        }
      }
    });
  }

  // 数字入力
  function inputNumber(num) {
    if (!selected) return;
    const { row, col } = selected;

    // 初期配置セルは変更不可
    if (puzzle[row][col] !== 0) return;

    if (memoMode && num !== 0) {
      // メモモード
      if (memos[row][col].has(num)) {
        memos[row][col].delete(num);
      } else {
        memos[row][col].add(num);
      }
      board[row][col] = 0;
    } else {
      // 通常入力
      if (num === 0) {
        board[row][col] = 0;
        memos[row][col].clear();
      } else {
        board[row][col] = num;
        memos[row][col].clear();

        // 正誤チェック
        if (num !== solution[row][col]) {
          mistakes++;
          updateMistakes();
        } else {
          // 正解の場合、同じ行・列・ボックスのメモからその数字を削除
          clearMemosRelated(row, col, num);
        }
      }
    }

    renderBoard();
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

  // 数字パッドの状態更新（9個揃った数字をグレーアウト）
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

    // クリア
    gameActive = false;
    if (timerInterval) clearInterval(timerInterval);

    completeTime.textContent = `タイム: ${formatTime(seconds)}`;
    completeMistakes.textContent = `ミス: ${mistakes}回`;
    completeModal.classList.remove('hidden');
  }

  // タイマー表示更新
  function updateTimer() {
    timerEl.textContent = formatTime(seconds);
  }

  function formatTime(s) {
    const min = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }

  // ミス表示更新
  function updateMistakes() {
    mistakesEl.textContent = `ミス: ${mistakes}`;
  }

  init();
})();
