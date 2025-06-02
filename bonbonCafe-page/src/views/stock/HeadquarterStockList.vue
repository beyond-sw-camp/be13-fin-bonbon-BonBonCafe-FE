<template>
  <div class="stock-wrapper ma-10 pa-8">
    <h3 class="text-2xl font-semibold mb-6">🏢 본사 재고 목록</h3>

    <!-- 🔍 검색 + 추가 버튼 -->
    <div class="d-flex justify-between align-center mb-6 flex-wrap" style="gap: 12px;">
      <v-text-field
        v-model="search"
        label="재료명 검색"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="comfortable"
        hide-details
        class="flex-grow-1"
        @keyup.enter="onSearch"
      />
      <v-btn color="#D8DBBD" variant="flat" @click="goToRegister">재고 추가</v-btn>
    </div>

    <!-- 📋 재고 테이블 -->
    <v-card class="rounded-table-card elevation-1">
      <v-data-table
  :headers="headers"
  :items="stocks"
  class="rounded-table"
  density="comfortable"
  hide-default-footer
>
  <template #item="{ item, index }">
    <tr @click="goToStockDetail(item)" style="cursor: pointer;">
      <!-- <td>{{ index + 1 }}</td> -->
      <td>{{ item.ingredientName }}</td>
      <td>{{ item.quantity }} {{ item.unit }}</td>
      <td>{{ formatPrice(item.unitPrice) }}원</td>
      <td>{{ formatPrice(item.retailPrice) }}원</td>
    </tr>
  </template>
</v-data-table>
    </v-card>

    <!-- 📄 페이징 -->
    <v-pagination
      v-model="page"
      :length="totalPages"
      class="mt-4 custom-pagination"
      color="black"
      @input="fetchStocks"
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
const search = ref('')

const headers = [
  { title: '재료명', key: 'ingredientName' },
  { title: '수량', key: 'quantity' },
  { title: '단가', key: 'unitPrice' },
  { title: '소비자가', key: 'retailPrice' },
  // { title: '본사명', key: 'headquarterName' }
]

const fetchStocks = async () => {
  try {
    const { data } = await apiClient.get(`/headquarter-stocks`, {
      params: {
        page: page.value - 1,
        search: search.value || null
      }
    })
    stocks.value = data.content
    totalPages.value = data.totalPages
  } catch (e) {
    console.error('❌ 재고 조회 실패', e)
  }
}

const onSearch = () => {
  page.value = 1
  fetchStocks()
}

const goToStockDetail = (item) => {
  console.log('✅ 클릭된 row:', item)

  if (!item?.stockId) {
    alert('stockId가 없습니다.')
    return
  }

  router.push({
    name: 'headquarter-stock-detail',
    params: { headquarterStockId: item.stockId }
  })
}

const goToRegister = () => {
  router.push({ name: 'headquarter-stock-register' })
}

const formatPrice = (price) => {
  return price ? Number(price).toLocaleString() : '-'
}

onMounted(fetchStocks)
watch(page, fetchStocks)
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