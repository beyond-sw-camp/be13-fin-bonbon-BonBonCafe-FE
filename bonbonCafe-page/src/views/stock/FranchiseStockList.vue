<template>
  <v-container class="py-4 hei" fluid>
    <v-row dense>
      <v-col cols="12" md="10" offset-md="1">
        <v-card class="pa-6 elevation-2" style="min-height: 650px;">
          <v-typography class="list" align="center">재고&발주 관리 /</v-typography>
          <v-typography class="title" align="center">가맹점 재고 목록</v-typography>

          <br /><br />

          <!-- 🔘 재고 주문 버튼 -->
          <v-row class="mb-4" justify="end">
            <v-btn color="primary" variant="flat" @click="goToStockOrder">재고 주문</v-btn>
          </v-row>

          <!-- 📋 테이블 -->
          <v-data-table
            :headers="headers"
            :items="stocks"
            class="rounded-table"
            density="comfortable"
            hide-default-footer
          >
            <template #item="{ item }">
              <tr>
                <td class="text-center">{{ item.ingredientName }}</td>
                <td class="text-center">{{ item.quantity }} {{ item.unit }}</td>
                <td class="text-center">{{ formatPrice(item.unitPrice) }}원</td>
                <td class="text-center">{{ formatPrice(item.retailPrice) }}원</td>
              </tr>
            </template>
          </v-data-table>

          <!-- 📄 페이지네이션 -->
          <v-row class="mt-4 justify-end">
            <v-pagination
              v-model="page"
              :length="totalPages"
              :total-visible="5"
              color="primary"
              @input="fetchFranchiseStocks"
            />
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
  { title: '재료명', key: 'ingredientName', align: 'center', sortable: false },
  { title: '수량', key: 'quantity', align: 'center', sortable: false },
  { title: '단가', key: 'unitPrice', align: 'center', sortable: false },
  { title: '소비자가', key: 'retailPrice', align: 'center', sortable: false }
]

const fetchFranchiseStocks = async () => {
  try {
    const res = await apiClient.get('/franchise-stocks', {
      params: { page: page.value - 1 }
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
.title {
  font-size: 20px;
  font-weight: 600;
  color: #3f51b5;
}

.list {
  font-size: 16px;
  font-weight: 600;
  color: gray;
}

.hei {
  min-height: 900px;
}

:deep(.rounded-table thead) {
  background-color: #f2f5f8;
}

:deep(.rounded-table td),
:deep(.rounded-table th) {
  text-align: center;
}

:deep(.rounded-table tbody tr:hover) {
  background-color: #f4faff;
  cursor: pointer;
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
  background-color: #caddf0 !important;
  color: black !important;
}
</style>
