<template>
  <div class="history-wrapper ma-16 mt-4 pa-10">
    <h3 class="text-2xl font-semibold mb-6">📦 재고 신청 내역</h3>

    <v-card class="rounded-header-card elevation-1">
      <v-table class="rounded-header-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>재료명</th>
            <th>수량</th>
            <th>신청일</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in histories"
            :key="item.historyId"
            @click="goToDetail(item.historyId)"
            style="cursor: pointer;"
          >
            <td>{{ totalElements - (page - 1) * pageSize - index }}</td>
            <td>{{ item.ingredientName }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ formatDate(item.date) }}</td>
            <td>{{ statusLabel(item.historyStatus) }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-pagination
      v-model="page"
      :length="totalPages"
      @input="fetchHistory"
      class="mt-4"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '@/api'

const route = useRoute()
const router = useRouter()

const page = ref(1)
const pageSize = 10
const totalPages = ref(1)
const totalElements = ref(0)
const histories = ref([])

const priceMap = ref({}) // ingredientName → unitPrice

const unitPrice = (item) => {
  return priceMap.value[item.ingredientName] || 0
}

const fetchFranchiseStocks = async () => {
  try {
    const res = await apiClient.get(`/franchise-stocks`)
    priceMap.value = Object.fromEntries(
      res.data.content.map(stock => [stock.ingredientName, stock.unitPrice])
    )
  } catch (e) {
    console.error('❌ 단가 목록 불러오기 실패', e)
  }
}

const fetchHistory = async () => {
  try {
    const { data } = await apiClient.get(`/franchiseOrder/list`, {
      params: {
        page: page.value - 1
      }
    })
    histories.value = data.content
    totalPages.value = data.totalPages
    totalElements.value = data.totalElements
  } catch (e) {
    console.error('❌ 재고 신청 내역 조회 실패', e)
  }
}

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString()

const formatPrice = (price) => {
  return price ? Number(price).toLocaleString() + '원' : '-'
}

const totalPrice = (item) => {
  const unitPrice = priceMap.value[item.ingredientName] || 0
  return unitPrice * item.quantity
}

const statusLabel = (status) => {
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

const goToDetail = (historyId) => {
  if (!historyId) return
  router.push({
    name: 'stock-history-detail',
    params: {
      historyId
    }
  })
}

onMounted(() => {
  fetchHistory()
  fetchFranchiseStocks()
})
watch(page, fetchHistory)
</script>

<style scoped>
.history-wrapper {
  background-color: #f5f5f5;
}

.rounded-header-card {
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

::v-deep(.rounded-header-table thead tr) {
  background-color: #D8DBBD;
}

::v-deep(.rounded-header-table thead tr:first-child th:first-child) {
  border-top-left-radius: 12px;
}
::v-deep(.rounded-header-table thead tr:first-child th:last-child) {
  border-top-right-radius: 12px;
}
</style>