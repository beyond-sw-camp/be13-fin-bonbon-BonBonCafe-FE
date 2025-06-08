<template>
  <v-container class="py-4" fluid>
    <v-row dense>
      <v-col cols="12" md="10" offset-md="1">
        <v-card class="pa-6 elevation-2" style="min-height: 650px;">
          <v-typography class="list" align="center">재고&발주 관리 /</v-typography>
          <v-typography class="title" align="center">본사 재고 조회</v-typography>

          <br /><br />

          <!-- 🔍 검색 + 추가 버튼 -->
          <v-row class="mb-6" align="center" justify="space-between">
            <v-col cols="12" md="8">
              <v-text-field
                v-model="search"
                label="재료명 검색"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="comfortable"
                hide-details
                @keyup.enter="onSearch"
              />
            </v-col>
            <v-col cols="12" md="4" class="text-right">
              <v-btn
  color="primary"
  @click="goToRegister"
  v-if="userRole === 'ROLE_HEADQUARTER'"
>
  <v-icon start>mdi-plus</v-icon>
  재고 추가
</v-btn>
            </v-col>
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
              <tr @click="goToStockDetail(item)" style="cursor: pointer;">
                <td>{{ item.ingredientName }}</td>
                <td>{{ item.quantity }} {{ item.unit }}</td>
                <td>{{ formatPrice(item.unitPrice) }}원</td>
                <td>{{ formatPrice(item.retailPrice) }}원</td>
              </tr>
            </template>
          </v-data-table>

          <!-- 📄 페이징 및 페이지 수 -->
          <v-row class="mt-4 align-center justify-space-between">
            <v-col cols="auto">
              <v-select
                v-model="pageSize"
                :items="[5, 10]"
                density="compact"
                variant="outlined"
                hide-details
                @update:model-value="onPageSizeChange"
                style="max-width: 100px"
              />
            </v-col>
            <v-col cols="auto">
              <v-pagination
                v-model="page"
                :length="totalPages"
                color="primary"
                @input="fetchStocks"
              />
            </v-col>
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
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const userRole = authStore.userInfo.role
const router = useRouter()
const stocks = ref([])
const page = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)
const search = ref('')

const headers = [
  { title: '재료명', key: 'ingredientName' },
  { title: '수량', key: 'quantity' },
  { title: '단가', key: 'unitPrice' },
  { title: '소비자가', key: 'retailPrice' }
]

const fetchStocks = async () => {
  try {
    const { data } = await apiClient.get(`/headquarter-stocks`, {
      params: {
        page: page.value - 1,
        size: pageSize.value,
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

const onPageSizeChange = () => {
  page.value = 1
  fetchStocks()
}

const goToStockDetail = (item) => {
  if (userRole !== 'ROLE_HEADQUARTER') {
    // 상세 이동 막고 무반응
    return
  }

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

:deep(.rounded-table thead) {
  background-color: #f2f5f8;
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