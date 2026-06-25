# 🤖 Androidネイティブアプリのビルド手順

本プロジェクトの `android_app/` は、Web技術（React）で作られた画面を「Capacitor」という技術で包み込み、**本物のAndroidアプリ（.apkファイル）**としてビルドできる構成になっています。

以下の手順で、実際にお手元のAndroid端末にインストールできるアプリを生成します。

## 事前準備
1. **Android Studio** のインストール
   - Google公式の [Android Studio](https://developer.android.com/studio) をダウンロードしてインストールします。
2. **Java (JDK) / Android SDK** のセットアップ
   - Android Studio の初回起動時に案内される推奨設定のままインストールを進めれば完了します。

---

## 🏗️ アプリのビルド手順（Android Studioを使用）

### 1. 最新のWebコードをネイティブ側に同期する
UIの変更（Reactコードの修正）を行った場合は、必ず以下のコマンドを実行して最新の状態をAndroidプロジェクトに反映させてください。

```bash
cd path/to/diet-dashboard/android_app
npm run build
npx cap sync
```

### 2. Android Studio でプロジェクトを開く
以下のコマンドを実行すると、自動的に Android Studio が起動し、プロジェクトが開かれます。
```bash
npx cap open android
```
※ コマンドで開かない場合は、Android Studioを起動し、「Open」から `android_app/android` フォルダを選択して開いてください。

### 3. APKの生成
1. Android Studio 上部のメニューから **Build > Build Bundle(s) / APK(s) > Build APK(s)** をクリックします。
2. 画面右下に「Build APK(s) successfully」という通知が出たら完了です。
3. 通知内の **「locate」** をクリックすると、生成された `.apk` ファイル（`app-debug.apk`）の入ったフォルダが開きます。

---

## 📱 スマホへのインストール手順

1. 出来上がった `.apk` ファイルを、Google Driveやメール等を使ってお手元のAndroid端末に送ります（もしくはUSBケーブルで直接転送します）。
2. Android端末で `.apk` ファイルを開きます。
3. 「提供元不明のアプリのインストール」の警告が出た場合は、設定から許可を行ってください。
4. インストールが完了すると、ホーム画面に「diet-dashboard」というネイティブアプリのアイコンが追加されます！
