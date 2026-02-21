# ナンプレ - 無料オンライン数独パズル

ブラウザで遊べるナンプレ（数独）ゲームです。毎回ランダムに生成されるパズルを3段階の難易度で楽しめます。

## 機能

### ゲームプレイ

- **3段階の難易度** - 初級（ヒント36〜40）・中級（ヒント28〜32）・上級（ヒント22〜26）
- **ランダム生成** - 毎回異なるパズルを生成。唯一解を保証
- **メモ機能** - 候補数字を小さく記録
- **Undo/Redo** - 入力の取り消し・やり直し
- **タイマー・ミスカウント** - プレイ中の経過時間とミス回数を表示
- **結果シェア** - クリア結果をX（Twitter）やクリップボードで共有
- **キーボード操作** - 矢印キー、WASD、Emacsキーバインド対応

### グローバル対応

- **多言語対応** - 日本語（ja）と英語（en）に対応。ブラウザ言語設定で自動切り替え
- **レスポンシブデザイン** - モバイル、タブレット、デスクトップ対応
- **アクセシビリティ** - キーボードのみでプレイ可能、セマンティックHTML

### SEO & 収益化

- **SEO最適化** - robots.txt、sitemap.xml、hreflang、構造化データ対応
- **Google AdSense対応** - 広告スロット実装（ブラウザ言語に応じて自動配信）
- **GDPR対応** - Cookie同意バナー、プライバシーポリシーページ

## キーボードショートカット

| 操作           | キー                           |
| -------------- | ------------------------------ |
| セル移動       | 矢印キー / WASD / Ctrl+P/N/B/F |
| 数字入力       | 1-9                            |
| 消去           | 0 / Backspace / Delete         |
| メモモード切替 | M                              |
| 元に戻す       | Ctrl+Z                         |
| やり直し       | Ctrl+Y / Ctrl+Shift+Z          |

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
│   ├── index.html        # メインHTML（i18n、SEO、AdSense対応）
│   ├── privacy.html      # プライバシーポリシー（日英両対応）
│   ├── style.css         # スタイルシート
│   ├── app.js            # フロントエンドロジック（i18n、Cookie同意）
│   ├── robots.txt        # 検索エンジン用クローラー制御
│   └── sitemap.xml       # XML サイトマップ（hreflang対応）
├── src/
│   ├── server.js         # Express APIサーバー
│   ├── sudoku.js         # パズル生成エンジン
│   └── sudoku.test.js    # パズル生成テスト
├── .github/
│   └── workflows/        # GitHub Actions CI/CD パイプライン
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## API

### `GET /api/puzzle?difficulty={easy|medium|hard}`

パズルを生成して返します。

**パラメータ:**

- `difficulty` (required): `easy`, `medium`, `hard` のいずれか

**レスポンス例:**

```json
{
  "puzzle": [[5,3,0,...], ...],
  "solution": [[5,3,4,...], ...],
  "difficulty": "medium",
  "hints": 30,
  "grade": {
    "techniques": ["naked_single", "hidden_single"],
    "score": 150
  }
}
```

### その他のエンドポイント

- `GET /` - メインページ（index.html）
- `GET /privacy.html` - プライバシーポリシー
- `GET /robots.txt` - クローラー制御
- `GET /sitemap.xml` - XML サイトマップ

## グローバル公開前の準備

このプロジェクトは以下の機能を含むため、グローバル公開前に以下の設定が必要です。

### 1. Google AdSense の設定

`public/index.html` 内の以下を実際の値に置き換えてください：

```html
<!-- Line 145 -->
<script id="adsense-script" data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" async></script>

<!-- Line 172, 174 (in-game ad) -->
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="XXXXXXXXXX"

<!-- Line 233, 235 (footer ad) -->
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="XXXXXXXXXX"
```

### 2. OG イメージの作成

ソーシャルメディア共有用に、以下の OG 画像を作成して配置してください：

- **ファイル名:** `public/og-image.png`
- **サイズ:** 1200×630px
- **推奨:** ゲームスクリーンショットまたはロゴ

### 3. Google Search Console への登録

1. [Google Search Console](https://search.google.com/search-console) に登録
2. ドメイン所有権を確認
3. `public/sitemap.xml` を登録
4. URL検査ツールでインデックス登録をリクエスト

### 4. Google AdSense 審査

1. サイトを公開してから AdSense に申請
2. このリポジトリにはプライバシーポリシー（`public/privacy.html`）が含まれています
3. Cookie同意バナーも実装済みです

### 5. ドメインの指定

現在、canonical URLは `https://nanpure.meg4ne.net/` に設定されています。
実際のドメインが異なる場合は、以下を更新してください：

```bash
# public/index.html
# Line 10, 16, 20 など
https://nanpure.meg4ne.net/ → あなたのドメイン

# public/robots.txt
https://nanpure.meg4ne.net/sitemap.xml → あなたのドメイン

# public/sitemap.xml
https://nanpure.meg4ne.net/ → あなたのドメイン
```

## 技術スタック

- **フロントエンド:** HTML5 / CSS3 / Vanilla JavaScript（フレームワークなし）
- **バックエンド:** Node.js + Express
- **パズル生成:** バックトラッキング + 唯一解検証アルゴリズム
- **多言語対応:** i18n システム（日本語/英語）
- **デプロイ:** Docker
- **CI/CD:** GitHub Actions（テスト、リント、パフォーマンス監視）

## テスト & リント

```bash
# ユニットテスト実行
npm test

# ウォッチモード（開発時）
npm run test:watch

# カバレッジレポート
npm run test:coverage

# ESLint + Prettier でコード品質チェック
npm run lint

# 自動修正
npm run lint:fix

# コードフォーマット
npm run format
npm run format:check
```

## パフォーマンス

GitHub Actions により、以下の品質指標が自動チェックされます：

- **Lighthouse:** Performance ≥90%, Accessibility ≥95%, SEO ≥95%
- **Bundle Size:** 最小化された JS/CSS
- **Security:** npm audit, CodeQL, Snyk スキャン

## 多言語対応の詳細

### サポート言語

| 言語   | コード | 自動判定                              |
| ------ | ------ | ------------------------------------- |
| 日本語 | `ja`   | `navigator.language.startsWith('ja')` |
| 英語   | `en`   | その他すべて                          |

### 翻訳の追加方法

`public/app.js` 内の `translations` オブジェクトを編集：

```javascript
const translations = {
  ja: {
    /* 日本語 */
  },
  en: {
    /* 英語 */
  },
  // 新しい言語を追加
  // fr: { /* フランス語 */ },
};
```

## ライセンス

MIT
