<template>
  <div class="stock-wrapper ma-10 pa-8">
    <h3 class="text-2xl font-semibold mb-6">🏢 본사 재고 조회</h3>

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

    <!-- 📦 재고 카드 목록 -->
    <v-row>
      <v-col
        v-for="stock in stocks"
        :key="stock.stockId"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="stock-card hoverable" @click="goToStockDetail(stock.stockId)">
          <v-card-title class="text-lg font-semibold">
            {{ stock.ingredientName }}
          </v-card-title>

          <v-card-subtitle class="text-sm mb-2">
            {{ stock.quantity }} {{ stock.unit }}
          </v-card-subtitle>

          <v-card-text class="text-sm">
            <div>단가: {{ formatPrice(stock.unitPrice) }}원</div>
            <div>소비자가: {{ formatPrice(stock.retailPrice) }}원</div>
            <div class="mt-2 text-caption text-grey-darken-1">본사: {{ stock.headquarterName }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 📄 페이징 -->
    <v-pagination
      v-model="page"
      :length="totalPages"
      class="mt-8"
      color="primary"
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

const goToStockDetail = (stockId) => {
  router.push({ name: 'headquarter-stock-detail', params: { headquarterStockId: stockId } })
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

.hoverable {
  cursor: pointer;
  transition: transform 0.2s ease;
}
.hoverable:hover {
  transform: scale(1.02);
}

.stock-card {
  background-color: white;
  border-radius: 12px;
  padding: 12px;
  min-height: 160px;
}
</style>