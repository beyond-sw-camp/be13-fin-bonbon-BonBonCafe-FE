<template>
  <div>
    <h3>📦 가맹점 재고 신청 내역 (전체)</h3>

    <v-text-field
      v-model="search"
      label="가맹점 이름 검색"
      class="mb-4"
      @keyup.enter="fetchHistories"
    />

    <v-data-table
      :headers="headers"
      :items="filteredHistories"
      :items-per-page="10"
      class="elevation-1"
      :loading="loading"
      @click:row="goToDetailPage"
    >
      <template #item.date="{ item }">
        {{ formatDate(item.date) }}
      </template>
      <template #item.historyStatus="{ item }">
        {{ statusLabel(item.historyStatus) }}
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '@/api'

const route = useRoute()
const router = useRouter()
const headquarterId = route.params.headquarterId
// const headquarterId = 1

const histories = ref([])
const loading = ref(false)
const search = ref('')

const headers = [
  { title: '가맹점명', value: 'franchiseName' },
  { title: '재료명', value: 'ingredientName' },
  { title: '수량', value: 'quantity' },
  { title: '상태', value: 'historyStatus' },
  { title: '신청일', value: 'date' }
]

const fetchHistories = async () => {
  loading.value = true
  try {
    const { data } = await apiClient.get(`/franchiseOrder/headquarter/${headquarterId}/franchise-history-list`)
    histories.value = data.content || []
  } catch (e) {
    console.error('❌ 전체 조회 실패', e)
    alert('조회 실패')
  } finally {
    loading.value = false
  }
}

const filteredHistories = computed(() => {
  if (!search.value.trim()) return histories.value
  return histories.value.filter(h =>
    h.franchiseName.toLowerCase().includes(search.value.toLowerCase())
  )
})

const formatDate = dateStr => new Date(dateStr).toLocaleDateString()

const statusLabel = status => {
  const map = {
    REQUESTED: '신청됨',
    APPROVED: '승인됨',
    REJECTED: '거절됨',
    SHIPPED: '배송 중',
    DELIVERED: '배송 완료',
    CANCELLED: '취소됨'
  }
  return map[status] || status
}

const goToDetailPage = (item) => {
  
  router.push({
    name: 'stock-history-detail',
    params: {
      headquarterId,
      franchiseId: 24, // 하드코딩
      historyId: 44   // 하드코딩
    }
  })
}

onMounted(fetchHistories)
</script>