# Arugatou Journal App

## 概要

Gratitude App は、毎日の感謝の気持ちを記録し、AI からの励ましを受け取ることができるアプリケーションです。ユーザーは寝る前にその日感謝できることを 3 つ入力し、AI からの返信を受け取ることができます。

## 機能

- 日々の感謝事項の記録（3 つ）
- AI からの返信機能
- 過去の記録の閲覧（予定）

## 技術スタック

### フロントエンド

- **フレームワーク**: React 18.3.1
- **言語**: TypeScript 5.2.2
- **ビルドツール**: Vite 5.3.4
- **ルーティング**: React Router DOM 6.26.0
- **フォーム管理**: React Hook Form 7.52.2
- **HTTP クライアント**: Axios 1.7.3

### バックエンド

- **データベース**: Supabase 2.45.0
- **認証**: Firebase 10.12.5

### スタイリング

- **CSS フレームワーク**: Tailwind CSS 3.4.8
- **UI コンポーネント**: DaisyUI 4.12.10

### テスティング

- Jest (@types/jest: 29.5.12)
- React Testing Library (@testing-library/react: 16.0.0)
- User Event (@testing-library/user-event: 14.5.2)
- Jest DOM (@testing-library/jest-dom: 6.4.8)

## セットアップ

1. リポジトリをクローンします：
   ```bash
   git clone [リポジトリのURL]
   ```
   2.依存関係をインストールします：

```bash
 npm install
```

3. 環境変数を設定します：
   .env.local ファイルを作成し、必要な環境変数を設定します。 4.アプリケーションを起動します：

```bash
 npm run dev
```

## 開発

このプロジェクトは Vite を使用しています。Vite は高速な開発サーバーとビルドツールを提供し、効率的な開発体験を実現します。
主な Vite コマンド：

- `npm run dev`: 開発サーバーを起動
- `npm run build`: プロダクション用にアプリケーションをビルド
- `npm run preview`: ビルドされたアプリケーションをプレビュー

## 使い方

アプリにログインまたはアカウントを作成します。
ホーム画面で「今日の感謝」ボタンをクリックします。
その日に感謝できることを 3 つ入力します。
送信ボタンをクリックすると、AI からの返信が表示されます。

## テスト

テストを実行するには以下のコマンドを使用します：

```bash
 npm run test
```
