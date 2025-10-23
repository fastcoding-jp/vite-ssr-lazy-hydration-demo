<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

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

interface Props {
  place: Place
}

const props = defineProps<Props>()

// 重いデータ処理をシミュレート（レビュー、営業時間など）
const reviews = ref<Array<{ author: string; rating: number; comment: string; date: string }>>([])
const openingHours = ref<Array<{ day: string; hours: string }>>([])
const nearbyPlaces = ref<Array<{ name: string; distance: string }>>([])

onMounted(() => {
  console.log('🎯 [遅延ハイドレーション] PlaceDetail コンポーネントがハイドレーションされました')
  console.log(`📍 スポット: ${props.place.name}`)

  // 重い処理をシミュレート
  const startTime = performance.now()
  console.log('⏱️  重いデータ処理を開始...')

  // レビューデータを生成
  const sampleReviews = [
    { author: '山田太郎', rating: 5, comment: '素晴らしい場所でした！また行きたいです。', date: '2024-01-15' },
    { author: '田中花子', rating: 4, comment: '雰囲気が良くて家族で楽しめました。', date: '2024-01-10' },
    { author: '佐藤次郎', rating: 5, comment: '期待以上でした。おすすめです！', date: '2024-01-05' },
    { author: '鈴木美咲', rating: 4, comment: '写真映えするスポットがたくさんあります。', date: '2023-12-20' }
  ]

  // 営業時間データ
  const hours = [
    { day: '月曜日', hours: '9:00 - 18:00' },
    { day: '火曜日', hours: '9:00 - 18:00' },
    { day: '水曜日', hours: '9:00 - 18:00' },
    { day: '木曜日', hours: '9:00 - 18:00' },
    { day: '金曜日', hours: '9:00 - 18:00' },
    { day: '土曜日', hours: '9:00 - 20:00' },
    { day: '日曜日', hours: '9:00 - 20:00' }
  ]

  // 周辺スポット
  const nearby = [
    { name: 'カフェABC', distance: '200m' },
    { name: 'レストランXYZ', distance: '350m' },
    { name: 'コンビニ', distance: '100m' }
  ]

  // 重い計算をシミュレート
  let result = 0
  for (let i = 0; i < 5000000; i++) {
    result += Math.sqrt(i)
  }

  reviews.value = sampleReviews
  openingHours.value = hours
  nearbyPlaces.value = nearby

  const endTime = performance.now()
  console.log(`✅ データ処理完了: ${(endTime - startTime).toFixed(2)}ms`)
  console.log(`💡 この処理は初期ページ読み込み時ではなく、スポット選択時に実行されました`)
})

const averageRating = computed(() => {
  if (reviews.value.length === 0) return props.place.rating
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
  return (sum / reviews.value.length).toFixed(1)
})

const renderStars = (rating: number) => {
  return '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '⭐' : '')
}
</script>

<template>
  <div class="place-detail">
    <div class="detail-header">
      <img :src="place.image" :alt="place.name" class="place-image" />
      <div class="header-info">
        <h2>{{ place.name }}</h2>
        <div class="rating">
          <span class="stars">{{ renderStars(place.rating) }}</span>
          <span class="rating-value">{{ averageRating }}</span>
          <span class="review-count">({{ reviews.length }}件のレビュー)</span>
        </div>
        <span class="category-badge">{{ place.category }}</span>
      </div>
    </div>

    <div class="detail-body">
      <section class="description-section">
        <h3>📝 説明</h3>
        <p>{{ place.description }}</p>
      </section>

      <section class="hours-section">
        <h3>🕒 営業時間</h3>
        <div class="hours-list">
          <div v-for="hour in openingHours" :key="hour.day" class="hour-item">
            <span class="day">{{ hour.day }}</span>
            <span class="time">{{ hour.hours }}</span>
          </div>
        </div>
      </section>

      <section class="reviews-section">
        <h3>💬 レビュー</h3>
        <div class="reviews-list">
          <div v-for="review in reviews" :key="review.author + review.date" class="review-item">
            <div class="review-header">
              <div class="review-author">
                <div class="avatar">{{ review.author[0] }}</div>
                <div>
                  <div class="author-name">{{ review.author }}</div>
                  <div class="review-stars">{{ renderStars(review.rating) }}</div>
                </div>
              </div>
              <span class="review-date">{{ review.date }}</span>
            </div>
            <p class="review-comment">{{ review.comment }}</p>
          </div>
        </div>
      </section>

      <section class="nearby-section">
        <h3>📍 周辺スポット</h3>
        <div class="nearby-list">
          <div v-for="nearby in nearbyPlaces" :key="nearby.name" class="nearby-item">
            <span class="nearby-name">{{ nearby.name }}</span>
            <span class="nearby-distance">{{ nearby.distance }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.place-detail {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.detail-header {
  position: relative;
}

.place-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.header-info {
  padding: 24px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: white;
}

.header-info h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.stars {
  font-size: 18px;
}

.rating-value {
  font-weight: 700;
  font-size: 18px;
}

.review-count {
  font-size: 14px;
  opacity: 0.9;
}

.category-badge {
  display: inline-block;
  padding: 6px 12px;
  background: rgba(66, 184, 131, 0.9);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.detail-body {
  padding: 24px;
}

.detail-body section {
  margin-bottom: 32px;
}

.detail-body section:last-child {
  margin-bottom: 0;
}

.detail-body h3 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 18px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e0e0e0;
}

.description-section p {
  color: #555;
  line-height: 1.8;
  font-size: 15px;
}

.hours-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hour-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
}

.day {
  font-weight: 600;
  color: #2c3e50;
}

.time {
  color: #666;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.review-author {
  display: flex;
  gap: 12px;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
}

.author-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.review-stars {
  font-size: 12px;
}

.review-date {
  font-size: 12px;
  color: #999;
}

.review-comment {
  margin: 0;
  color: #555;
  line-height: 1.6;
  font-size: 14px;
}

.nearby-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nearby-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
}

.nearby-name {
  color: #2c3e50;
  font-weight: 500;
}

.nearby-distance {
  color: #42b883;
  font-weight: 600;
}
</style>
