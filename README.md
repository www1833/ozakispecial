# ConsultBridge

ConsultBridge は、コンサルタントと企業の案件をマッチングするための UI プロトタイプです。Vite + React + TypeScript + Tailwind CSS で構築され、GitHub Pages へデプロイ可能なシングルページアプリケーション (SPA) です。

## 主な機能

- ホーム: 価値提案とクイック検索フォーム
- コンサルタント登録フォーム: バリデーション・タグ入力・完了モーダル
- 企業案件登録フォーム: バリデーション・タグ入力・完了モーダル
- 検索一覧: URL クエリと同期したフィルタリング、並び替え、ページング
- 詳細ページ: 連絡フォーム (localStorage 保存)
- 管理画面: 簡易認証、CRUD 操作、ダミー分析カード
- 疑似バックエンド: 初回ロード時に `/public/mock/*.json` から seed、以降は localStorage を利用

## 必要要件

- Node.js 18 以上
- npm 9 以上

## セットアップ

```bash
npm install
```

## ローカル開発

```bash
npm run dev
```

ブラウザで <http://localhost:5173/> を開きます。

## ビルド

```bash
npm run build
```

ビルド成果物は `dist/` に出力されます。ローカルでビルド結果を確認するには以下を実行します。

```bash
npm run preview
```

## GitHub Pages へのデプロイ

### Actions を使った自動デプロイ

1. GitHub リポジトリの *Settings › Pages* で `gh-pages` ブランチ、`/ (root)` を指定します。
2. `GITHUB_TOKEN` 権限に `contents: write` が有効になっていることを確認します。
3. `main` ブランチへ push すると、`.github/workflows/deploy.yml` が走り、`gh-pages` ブランチに自動デプロイされます。

### `gh-pages` パッケージを使った手動デプロイ

```bash
npm run build
npm run deploy
```

`dist/` の内容が `gh-pages` ブランチへ push され、GitHub Pages で公開されます。

## GitHub Pages でのルーティング対策

- `vite.config.ts` の `base` はリポジトリ名に追従するように設定済みです。
- SPA のルーティング向けに `public/404.html` を用意し、GitHub Pages でのリロード時もトップにリダイレクトします。

## 管理画面のパスコード

- 管理画面 (`/admin`) のパスコードは `4321` です。認証は sessionStorage に保持されます。

## プロジェクト構成

```
.
├── public
│   ├── mock
│   │   ├── consultants.json
│   │   └── projects.json
│   └── 404.html
├── src
│   ├── components
│   ├── lib
│   ├── pages
│   ├── types
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
└── ...
```

## ライセンス

このプロトタイプはデモ目的で提供されています。
