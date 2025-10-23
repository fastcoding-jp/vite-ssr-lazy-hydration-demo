<script setup lang="ts">
import { ref, defineAsyncComponent, hydrateOnVisible } from 'vue'
import MapView from './components/MapView.vue'

interface Place {
  id: number
  name: string
  lat: number
  lng: number
  category: string
  rating: number
  image: string
  description: string
}

// 詳細パネルを遅延ハイドレーション
const AsyncPlaceDetail = defineAsyncComponent({
  loader: () => import('./components/PlaceDetail.vue'),
  hydrate: hydrateOnVisible({ rootMargin: '50px' })
})

const selectedPlace = ref<Place | null>(null)

const handleSelectPlace = (place: Place) => {
  selectedPlace.value = place
}
</script>

<template>
  <div id="app">
    <header class="header">
      <div class="container">
        <h1>🗺️ 東京観光マップ</h1>
        <p class="subtitle">おすすめスポットを探す</p>
      </div>
    </header>

    <main class="container">
      <MapView @select-place="handleSelectPlace" />

      <div v-if="selectedPlace" class="detail-section">
        <AsyncPlaceDetail :place="selectedPlace" />
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📍</div>
        <p>マップ上のスポットをクリックして詳細を表示</p>
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 Tokyo Travel Guide</p>
      </div>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f5f5f5;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  padding: 0 20px;
}

/* Header */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.header h1 {
  font-size: 32px;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 16px;
  opacity: 0.9;
}

/* Main */
main {
  flex: 1;
  padding: 40px 20px;
}

.detail-section {
  margin-top: 32px;
}

.empty-state {
  margin-top: 32px;
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 16px;
  color: #666;
}

/* Footer */
.footer {
  background: #2c3e50;
  color: white;
  padding: 24px 0;
  text-align: center;
  margin-top: 60px;
}

.footer p {
  font-size: 14px;
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 768px) {
  .header h1 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }

  main {
    padding: 24px 16px;
  }

  .detail-section {
    margin-top: 24px;
  }
}
</style>
