<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

const emit = defineEmits<{
  selectPlace: [place: Place]
}>()

const mapContainer = ref<HTMLElement | null>(null)
const selectedPlaceId = ref<number | null>(null)
let map: google.maps.Map | null = null
const markers: google.maps.Marker[] = []

// サンプル地点データ
const places: Place[] = [
  {
    id: 1,
    name: '東京タワー',
    lat: 35.6586,
    lng: 139.7454,
    category: '観光',
    rating: 4.5,
    image: 'https://picsum.photos/seed/tokyo-tower/400/300',
    description: '東京のシンボル的存在。展望台からの眺めは絶景です。'
  },
  {
    id: 2,
    name: '浅草寺',
    lat: 35.7148,
    lng: 139.7967,
    category: '寺社',
    rating: 4.7,
    image: 'https://picsum.photos/seed/sensoji/400/300',
    description: '東京最古の寺院。雷門と仲見世通りが有名です。'
  },
  {
    id: 3,
    name: '渋谷スクランブル交差点',
    lat: 35.6595,
    lng: 139.7004,
    category: '観光',
    rating: 4.3,
    image: 'https://picsum.photos/seed/shibuya/400/300',
    description: '世界で最も有名な交差点の一つ。'
  },
  {
    id: 4,
    name: '上野動物園',
    lat: 35.7155,
    lng: 139.7738,
    category: 'レジャー',
    rating: 4.4,
    image: 'https://picsum.photos/seed/ueno-zoo/400/300',
    description: '日本最古の動物園。パンダが人気です。'
  },
  {
    id: 5,
    name: 'お台場海浜公園',
    lat: 35.6282,
    lng: 139.7752,
    category: 'レジャー',
    rating: 4.2,
    image: 'https://picsum.photos/seed/odaiba/400/300',
    description: 'レインボーブリッジと自由の女神像が見られる公園。'
  },
  {
    id: 6,
    name: '明治神宮',
    lat: 35.6764,
    lng: 139.6993,
    category: '寺社',
    rating: 4.6,
    image: 'https://picsum.photos/seed/meiji-shrine/400/300',
    description: '広大な森に囲まれた都会のオアシス。'
  }
]

const initMap = () => {
  try {
    if (!mapContainer.value) {
      console.warn('Map container not found')
      return
    }
    if (typeof window === 'undefined' || !window.google || !window.google.maps) {
      console.warn('Google Maps API not loaded')
      return
    }

    console.log('Initializing Google Maps...')

    // 地図の初期化
    map = new google.maps.Map(mapContainer.value, {
      center: { lat: 35.6812, lng: 139.7671 }, // 東京の中心
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    })

    // マーカーを追加
    places.forEach(place => {
      const marker = new google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: map,
        title: place.name,
        label: {
          text: place.id.toString(),
          color: 'white',
          fontWeight: 'bold'
        },
        animation: google.maps.Animation.DROP
      })

      marker.addListener('click', () => {
        handlePlaceClick(place)
        // 選択されたマーカーにアニメーション
        markers.forEach(m => m.setAnimation(null))
        marker.setAnimation(google.maps.Animation.BOUNCE)
        setTimeout(() => marker.setAnimation(null), 2000)
      })

      markers.push(marker)
    })

    console.log('Google Maps initialized successfully')
  } catch (error) {
    console.error('Error initializing Google Maps:', error)
  }
}

onMounted(() => {
  console.log('[MapView] Component mounted')

  // SSR環境ではスキップ
  if (typeof window === 'undefined') {
    console.log('[MapView] SSR environment detected, skipping')
    return
  }

  // Google Maps APIがロードされているか確認
  if (window.google && window.google.maps) {
    console.log('[MapView] Google Maps API already loaded')
    initMap()
    return
  }

  // すでにスクリプトが追加されているかチェック
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
  if (existingScript) {
    console.log('[MapView] Google Maps script already exists, waiting for load...')
    // スクリプトがロード完了するのを待つ
    if (window.google && window.google.maps) {
      initMap()
    } else {
      existingScript.addEventListener('load', () => {
        console.log('[MapView] Existing script loaded')
        initMap()
      })
    }
    return
  }

  // APIキーを環境変数から取得
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'
  console.log('[MapView] Loading Google Maps API with key:', apiKey.substring(0, 10) + '...')

  // Google Maps APIをロード
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&language=ja`
  script.async = true
  script.defer = true
  script.onload = () => {
    console.log('[MapView] Google Maps API loaded successfully')
    initMap()
  }
  script.onerror = (error) => {
    console.error('[MapView] Failed to load Google Maps API:', error)
  }

  // scriptをDOMに追加（nextTickで安全に追加）
  setTimeout(() => {
    try {
      if (document.head) {
        document.head.appendChild(script)
        console.log('[MapView] Script added to head')
      } else if (document.body) {
        document.body.appendChild(script)
        console.log('[MapView] Script added to body')
      } else {
        console.error('[MapView] Neither head nor body is available')
      }
    } catch (error) {
      console.error('[MapView] Error adding script:', error)
    }
  }, 0)
})

const handlePlaceClick = (place: Place) => {
  selectedPlaceId.value = place.id
  emit('selectPlace', place)

  // 地図の中心を移動
  if (map) {
    map.panTo({ lat: place.lat, lng: place.lng })
    map.setZoom(14)
  }
}
</script>

<template>
  <div class="map-view">
    <div ref="mapContainer" class="map-container">
    </div>

    <div class="places-sidebar">
      <h3>📍 おすすめスポット</h3>
      <div class="places-list">
        <div
          v-for="place in places"
          :key="place.id"
          class="place-item"
          :class="{ active: selectedPlaceId === place.id }"
          @click="handlePlaceClick(place)"
        >
          <div class="place-marker">{{ place.id }}</div>
          <div class="place-info">
            <h4>{{ place.name }}</h4>
            <span class="category">{{ place.category }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-view {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  height: 600px;
}

.map-container {
  background: #e8f4f8;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: relative;
  height: 100%;
}

.places-sidebar {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow-y: auto;
}

.places-sidebar h3 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 18px;
}

.places-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.place-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.place-item:hover {
  background: #f8f9fa;
}

.place-item.active {
  background: #e8f5e9;
  border-color: #42b883;
}

.place-marker {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.place-item.active .place-marker {
  background: #42b883;
}

.place-info {
  flex: 1;
  min-width: 0;
}

.place-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category {
  display: inline-block;
  padding: 2px 8px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .map-view {
    grid-template-columns: 1fr;
    height: auto;
  }

  .map-container {
    height: 400px;
  }

  .places-sidebar {
    max-height: 300px;
  }
}
</style>
