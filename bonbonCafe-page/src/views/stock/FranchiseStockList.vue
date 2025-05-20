<template>
  <div>
    <h3>📦 가맹점 재고 목록</h3>

    <!-- 🔘 재고 주문 버튼 -->
    <div class="d-flex justify-end mb-4">
      <v-btn color="primary" @click="goToStockOrder">재고 주문</v-btn>
    </div>

    <v-data-table :headers="headers" :items="stocks" :items-per-page="10" class="elevation-1">
      <template v-slot:item.unitPrice="{ item }">
        {{ formatPrice(item.unitPrice) }}원
      </template>

      <template v-slot:item.retailPrice="{ item }">
        {{ formatPrice(item.retailPrice) }}원
      </template>

      <template v-slot:item.quantity="{ item }">
        {{ item.quantity }} {{ item.unit }}
      </template>
    </v-data-table>
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
    console.log(stocks.value)
  } catch (e) {
    console.error('❌ 가맹점 재고 조회 실패', e,)
    alert('가맹점 재고 목록을 불러오지 못했습니다.')
  }
}

const formatPrice = (price) => {
  return price ? Number(price).toLocaleString() : '-'
}

// ✅ 단순히 이동만!
const goToStockOrder = () => {
  router.push('/stock-Order')
}

onMounted(fetchFranchiseStocks)
</script>

<style scoped>
h3 {
  margin-bottom: 20px;
}
</style>