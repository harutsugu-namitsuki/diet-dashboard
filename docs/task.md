# ダイエット・モチベーションダッシュボード 実装タスク

- [x] プロジェクトセットアップ
  - [x] Vite + React プロジェクトの初期化
  - [x] パッケージ (recharts, etc.) のインストール
- [x] UI / CSS 基盤構築
  - [x] グローバルCSS (Glassmorphism, Dark Neon theme) の作成
  - [x] コンポーネント用のCSS変数の定義
- [x] コンポーネントの実装
  - [x] Layout / Header (モチベーションフレーズ付き)
  - [x] Status Board (現在の体重、目標値、残り日数などのKPI)
  - [x] Chart Component (rechartsを使った理想/実績の折れ線グラフ)
  - [x] Input Form Component (体重入力・ローカルストレージ更新)
- [x] ロジック・ステート管理 (App.jsx)
  - [x] LocalStorage からのデータロード・保存ロジック
  - [x] これまでの25日分の過去データ（モック/実績）の初期状態設定
  - [x] 本日の目標体重の線形補間計算ロジック
- [x] 動作確認・修正
  - [ ] ローカル (`npm run dev`) でのテスト
  - [ ] バグ修正とブラッシュアップ

---
## 変更履歴 (Changelog)
* **2026-04-16**: 初版タスク完了（v1.0 シンプル版）、履歴削除機能の追加とデプロイ設定完了
