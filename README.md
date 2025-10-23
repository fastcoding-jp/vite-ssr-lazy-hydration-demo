# Vue 3.5 遅延ハイドレーション - 東京観光マップ

Vue 3.5の公式Lazy Hydration機能を使った実用的なサンプルです。

## 機能

- **Google Maps**: 東京のおすすめスポットを表示
- **詳細パネル**: スポットをクリックすると詳細情報を表示
- **遅延ハイドレーション**: 詳細パネルのJavaScript処理を遅延

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Google Maps APIキーの設定

`.env`ファイルを作成してAPIキーを設定してください：

```
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

Google Maps APIキーの取得方法：
https://developers.google.com/maps/documentation/javascript/get-api-key

### 3. 開発サーバー起動

**ローカル開発:**
```bash
npm run dev:tsx
```

**StackBlitz (プロダクションモード):**
```bash
npm start
```

http://localhost:3000 でアクセス

## 実装のポイント

### 詳細パネルの遅延ハイドレーション

```typescript
// src/App.vue
const AsyncPlaceDetail = defineAsyncComponent({
  loader: () => import('./components/PlaceDetail.vue'),
  hydrate: hydrateOnVisible({ rootMargin: '50px' })
})
```

詳細パネルは以下の重い処理を含んでいます：
- レビューデータの生成（約50ms）
- 営業時間の処理
- 周辺スポットの計算

これらの処理は、ユーザーがスポットをクリックして詳細パネルがスクロール範囲内に入るまで遅延されます。

### コンソールログで確認

ブラウザの開発者ツールを開き、スポットをクリックすると以下のログが出力されます：

```
🎯 [遅延ハイドレーション] PlaceDetail コンポーネントがハイドレーションされました
📍 スポット: 東京タワー
⏱️  重いデータ処理を開始...
✅ データ処理完了: 52.30ms
💡 この処理は初期ページ読み込み時ではなく、スポット選択時に実行されました
```

## ファイル構成

```
src/
├── App.vue                    # メインコンポーネント
├── components/
│   ├── MapView.vue           # Google Maps表示
│   └── PlaceDetail.vue       # スポット詳細（遅延ハイドレーション）
├── entry-client.ts           # クライアントエントリー
├── entry-server.ts           # サーバーエントリー
└── env.d.ts                  # TypeScript型定義
```

## 技術スタック

- Vue 3.5+ (Lazy Hydration)
- TypeScript
- Vite SSR
- Express
- Google Maps JavaScript API

## ライセンス

MIT
