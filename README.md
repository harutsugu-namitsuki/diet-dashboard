# 🚀 ダイエット・モチベーションダッシュボード

日々の体重記録を可視化し、モチベーションを極大化するための「完全ローカル＆自分専用（Local-First）」のダイエット進捗ストーキングアプリです。

![Dashboard Concept](https://img.shields.io/badge/Status-Active-brightgreen)
![Tech Stack](https://img.shields.io/badge/Tech-React_|_Vite-blue)
![Architecture](https://img.shields.io/badge/Architecture-Local_First-purple)

## 📌 プロジェクト概要
* **URL**: [GitHub PagesのURLが決まり次第ここに記載]
* **コンセプト**: 「行動を称賛し、明日への活力を生むコックピット」
* **特徴**:
  * サーバー不要（LocalStorageによるブラウザ完結型のデータ保存）
  * 平均目標からの遅れ・進みを「今日あるべき体重」として毎日自動算出
  * 前日比マイナス達成時の没入感あるお祝いアニメーション
  * ダークネオン・グラスモーフィズムによる洗練されたUI

---

## 📁 各種ドキュメントへのリンク（目次）

このプロジェクトを管理・拡張するための資料群です。

* 🔰 **[はじめてのプロジェクト解説](project_guide/はじめてのプロジェクト解説.md)**
  * 「このプロジェクトのファイル構造」や「どうやって動いているか」の大枠の解説。
* 📐 **[システム設計書 (Architecture Blueprint)](docs/システム設計書.md)**
  * データ構造やコンポーネント構成、今後の技術的ロードマップ。
* 📋 **[課題・バックログ管理表](project_management/課題_バックログ管理表.md)**
  * 今後追加したい機能のアイデア（Backlog）と、完了したタスクの管理。
* 📊 **[ダイエット進捗サマリー (初期要件)](docs/diet_status_summary.md)**
  * 開発スタート時点（v1.0）の目標計算式や基準値の検証結果。

---

## 💻 開発環境の立ち上げ方 (How to Run)

ローカル（お手元のパソコン）でアプリを起動して開発・確認を行うための手順です。

```bash
# 1. プロジェクトのフォルダに移動（すでにいる場合は不要）
cd path/to/diet-dashboard

# 2. 必要なライブラリのインストール
npm install

# 3. 開発サーバーの立ち上げ
npm run dev
```

起動後、表示される `http://localhost:5173/` にブラウザでアクセスしてください。

---

## 🏗️ デプロイ（Webへの公開）について
本プロジェクトは、GitHubにコードを `push` するだけで自動的に GitHub Actions が動作し、GitHub Pages 上の最新版アプリとして公開されるよう設定されています（`.github/workflows/deploy.yml` 参照）。
