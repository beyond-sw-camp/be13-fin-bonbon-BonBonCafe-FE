<template>
  <div class="stock-wrapper ma-16 mt-4 pa-10">
    <h3 class="text-2xl font-semibold mb-6">📦 가맹점 재고 목록</h3>

    <!-- 🔘 재고 주문 버튼 -->
    <div class="d-flex justify-end mb-4">
      <v-btn color="primary" @click="goToStockOrder">재고 주문</v-btn>
    </div>

    <!-- 📋 테이블 (v-card로 감싸서 둥근 모서리 배경 유지) -->
    <v-card class="rounded-table-card elevation-1">
      <v-data-table
        :headers="headers"
        :items="stocks"
        :items-per-page="10"
        class="rounded-table"
        density="comfortable"
      >
        <template #item.unitPrice="{ item }">
          {{ formatPrice(item.unitPrice) }}원
        </template>

        <template #item.retailPrice="{ item }">
          {{ formatPrice(item.retailPrice) }}원
        </template>

        <template #item.quantity="{ item }">
          {{ item.quantity }} {{ item.unit }}
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '@/api'

const route = useRoute()
const router = useRouter()

const stocks = ref([])

const headers = [
  { title: '가맹점명', key: 'franchiseName' },
  { title: '재료명', key: 'ingredientName' },
  { title: '수량', key: 'quantity' },
  { title: '단가', key: 'unitPrice' },
  { title: '소비자가', key: 'retailPrice' },
]

const fetchFranchiseStocks = async () => {
  try {
    const res = await apiClient.get(`/franchise-stocks`)
    stocks.value = res.data.content
  } catch (e) {
    console.error('❌ 가맹점 재고 조회 실패', e)
    alert('가맹점 재고 목록을 불러오지 못했습니다.')
  }
}

const formatPrice = (price) => {
  return price ? Number(price).toLocaleString() : '-'
}

const goToStockOrder = () => {
  router.push('/stock-Order')
}

onMounted(fetchFranchiseStocks)
</script>

<style scoped>
.stock-wrapper {
  background-color: #f5f5f5;
}

.rounded-table-card {
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

/* 헤더 배경색 */
::v-deep(.rounded-table thead) {
  background-color: #D8DBBD;
}
</style>