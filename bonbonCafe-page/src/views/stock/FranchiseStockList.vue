<template>
  <div class="stock-wrapper ma-16 mt-4 pa-10">
    <h3 class="text-2xl font-semibold mb-6">📦 가맹점 재고 목록</h3>

    <!-- 🔘 재고 주문 버튼 -->
    <div class="d-flex justify-end mb-4">
      <v-btn color="#D8DBBD" variant="flat" @click="goToStockOrder">재고 주문</v-btn>
    </div>

    <!-- 📋 테이블 -->
    <v-card class="rounded-table-card elevation-1">
      <v-data-table
        :headers="headers"
        :items="stocks"
        class="rounded-table"
        density="comfortable"
        hide-default-footer
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

    <!-- ✅ 사용자 정의 페이징 -->
    <v-pagination
      v-model="page"
      :length="totalPages"
      class="mt-4 custom-pagination"
      @input="fetchFranchiseStocks"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api'

const router = useRouter()

const stocks = ref([])
const page = ref(1)
const totalPages = ref(1)

const headers = [
  { title: '재료명', key: 'ingredientName' },
  { title: '수량', key: 'quantity' },
  { title: '단가', key: 'unitPrice' },
  { title: '소비자가', key: 'retailPrice' },
]

const fetchFranchiseStocks = async () => {
  try {
    const res = await apiClient.get('/franchise-stocks', {
      params: {
        page: page.value - 1
      }
    })
    stocks.value = res.data.content
    totalPages.value = res.data.totalPages
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
watch(page, fetchFranchiseStocks)
</script>

<style scoped>
.stock-wrapper {
  background-color: #f5f5f5;
}

.rounded-table-card {
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

::v-deep(.rounded-table thead) {
  background-color: #D8DBBD;
}

.custom-pagination {
  justify-content: center;
}

::v-deep(.v-pagination) {
  gap: 4px;
}

::v-deep(.v-pagination .v-btn) {
  min-width: 36px;
  height: 36px;
  border-radius: 6px;
  font-weight: bold;
}

::v-deep(.v-pagination .v-btn.v-btn--active) {
  background-color: #D8DBBD !important;
  color: black !important;
}
</style>