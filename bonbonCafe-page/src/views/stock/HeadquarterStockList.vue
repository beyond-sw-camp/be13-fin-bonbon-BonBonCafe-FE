<template>
  <div>
    <h3>본사 재고 조회</h3>

    <!-- 🔍 검색창 (재료명) -->
    <div class="d-flex mb-4" style="gap: 8px;">
      <v-text-field
        v-model="search"
        label="재료명 검색"
        prepend-inner-icon="mdi-magnify"
        class="flex-grow-1"
        @keyup.enter="onSearch"
      />
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
        <v-card class="hoverable" @click="goToStockDetail(stock.stockId)">
          <v-card-title>{{ stock.ingredientName }}</v-card-title>
          <v-card-subtitle>{{ stock.quantity }} {{ stock.unit }}</v-card-subtitle>
          <v-card-text>
            <div>단가: {{ stock.unitPrice.toLocaleString() }}원</div>
            <div>소비자가: {{ stock.retailPrice.toLocaleString() }}원</div>
            <div class="mt-2 text-caption grey--text">본사: {{ stock.headquarterName }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- ✅ 페이징 -->
    <v-pagination
      v-model="page"
      :length="totalPages"
      class="mt-4"
      @input="fetchStocks"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '@/api'

const route = useRoute()
const router = useRouter()
const headquarterId = route.params.headquarterId

const stocks = ref([])
const page = ref(1)
const totalPages = ref(1)
const search = ref('')

// 📦 전체 재고 조회 (검색 포함)
const fetchStocks = async () => {
  try {
    const { data } = await apiClient.get(`/headquarter-stocks/${headquarterId}`, {
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

// 🔍 검색 시 페이지 초기화
const onSearch = () => {
  page.value = 1
  fetchStocks()
}

// 📌 카드 클릭 시 재고 상세로 이동
const goToStockDetail = (stockId) => {
  router.push({ name: 'headquarter-stock-detail', params: { headquarterStockId: stockId } })
}

onMounted(fetchStocks)
watch(page, fetchStocks)
</script>

<style scoped>
.hoverable {
  cursor: pointer;
  transition: transform 0.2s ease;
}
.hoverable:hover {
  transform: scale(1.02);
}
</style>