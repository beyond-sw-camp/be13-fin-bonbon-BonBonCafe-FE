<template>
  <v-container class="py-4 hei" fluid>
    <v-row dense>
      <v-col cols="12" md="10" offset-md="1">
        <v-card class="pa-6 elevation-2" style="min-height: 650px;">
          <v-typography class="list" align="center">재고&발주 관리 /</v-typography>
          <v-typography class="title" align="center">재고 신청 내역</v-typography>

          <br /><br />

          <!-- 🔽 상태 필터 선택 -->
          <v-row class="mb-4" align="center" justify="end">
            <v-col cols="12" md="4">
              <v-select
                v-model="selectedStatus"
                :items="statusOptions"
                label="신청 처리 현황"
                item-title="label"
                item-value="value"
                clearable
                density="comfortable"
                variant="outlined"
                hide-details
                @update:model-value="onStatusChange"
              />
            </v-col>
          </v-row>

          <!-- 📋 테이블 -->
          <v-data-table
            :headers="headers"
            :items="histories"
            class="rounded-table"
            density="comfortable"
            hide-default-footer
          >
            <template #item="{ item, index }">
              <tr @click="goToDetail(item.historyId)" style="cursor: pointer;">
                <td class="text-center">{{ totalElements - (page - 1) * pageSize - index }}</td>
                <td class="text-center">{{ item.ingredientName }}</td>
                <td class="text-center">{{ item.quantity }} {{ item.unit || '' }}</td>
                <td class="text-center">{{ formatDate(item.date) }}</td>
                <td class="text-center">{{ statusLabel(item.historyStatus) }}</td>
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
              @input="fetchHistory"
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

const page = ref(1)
const pageSize = 10
const totalPages = ref(1)
const totalElements = ref(0)
const histories = ref([])
const selectedStatus = ref(null)

const priceMap = ref({})

const statusOptions = [
  { value: 'REQUESTED', label: '신청 완료' },
  { value: 'APPROVED', label: '승인 완료' },
  { value: 'REJECTED', label: '승인 거부' },
  { value: 'SHIPPED', label: '배송 진행 중' },
  { value: 'DELIVERED', label: '배송 완료' }
]

const unitPrice = (item) => priceMap.value[item.ingredientName] || 0

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
        page: page.value - 1,
        status: selectedStatus.value || null
      }
    })
    histories.value = data.content
    totalPages.value = data.totalPages
    totalElements.value = data.totalElements
  } catch (e) {
    console.error('❌ 재고 신청 내역 조회 실패', e)
  }
}

const onStatusChange = () => {
  page.value = 1
  fetchHistory()
}

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString()

const formatPrice = (price) => price ? Number(price).toLocaleString() + '원' : '-'

const totalPrice = (item) => unitPrice(item) * item.quantity

const statusLabel = (status) => {
  const map = {
    REQUESTED: '신청 완료',
    APPROVED: '승인 완료',
    REJECTED: '승인 거부',
    SHIPPED: '배송 진행 중',
    DELIVERED: '배송 완료'
  }
  return map[status] || status
}

const goToDetail = (historyId) => {
  if (!historyId) return
  router.push({ name: 'stock-history-detail', params: { historyId } })
}

onMounted(() => {
  fetchHistory()
  fetchFranchiseStocks()
})
watch(page, fetchHistory)

const headers = [
  { title: '번호', key: 'number', align: 'center', sortable: false },
  { title: '재료명', key: 'ingredientName', align: 'center', sortable: false },
  { title: '수량', key: 'quantity', align: 'center', sortable: false },
  { title: '신청일', key: 'date', align: 'center', sortable: false },
  { title: '상태', key: 'historyStatus', align: 'center', sortable: false }
]
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

:deep(.rounded-table tbody tr:hover) {
  background-color: #f4faff;
  cursor: pointer;
}
</style>