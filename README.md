# ナンプレ - 無料オンライン数独パズル

ブラウザで遊べるナンプレ（数独）ゲームです。毎回ランダムに生成されるパズルを3段階の難易度で楽しめます。

## 機能

- **3段階の難易度** - 初級（ヒント36〜40）・中級（ヒント28〜32）・上級（ヒント22〜26）
- **ランダム生成** - 毎回異なるパズルを生成。唯一解を保証
- **メモ機能** - 候補数字を小さく記録
- **Undo/Redo** - 入力の取り消し・やり直し
- **タイマー・ミスカウント** - プレイ中の経過時間とミス回数を表示
- **結果シェア** - クリア結果をX（Twitter）やクリップボードで共有
- **キーボード操作** - 矢印キー、WASD、Emacsキーバインド対応

## キーボードショートカット

| 操作 | キー |
|------|------|
| セル移動 | 矢印キー / WASD / Ctrl+P/N/B/F |
| 数字入力 | 1-9 |
| 消去 | 0 / Backspace / Delete |
| メモモード切替 | M |
| 元に戻す | Ctrl+Z |
| やり直し | Ctrl+Y / Ctrl+Shift+Z |

## セットアップ

### ローカル開発

```bash
npm install
npm start
# http://localhost:3000 でアクセス
```

開発モード（ファイル変更時に自動再起動）:

```bash
npm run dev
```

### Docker

```bash
docker compose up --build
# http://localhost:3000 でアクセス
```

## プロジェクト構成

```
nanpure/
├── public/
│   ├── index.html      # メインHTML（SEO対応）
│   ├── style.css       # スタイルシート
│   └── app.js          # フロントエンドロジック
├── src/
│   ├── server.js       # Express APIサーバー
│   └── sudoku.js       # パズル生成エンジン
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## API

### `GET /api/puzzle?difficulty={easy|medium|hard}`

パズルを生成して返します。

**レスポンス例:**

```json
{
  "puzzle": [[5,3,0,...], ...],
  "solution": [[5,3,4,...], ...],
  "difficulty": "medium",
  "hints": 30
}
```

## 技術スタック

- **フロントエンド:** HTML / CSS / Vanilla JavaScript
- **バックエンド:** Node.js + Express
- **パズル生成:** バックトラッキング + 唯一解検証アルゴリズム
- **デプロイ:** Docker

## ライセンス

MIT
