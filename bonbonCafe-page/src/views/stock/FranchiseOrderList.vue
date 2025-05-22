<template>
  <div class="table-wrapper ma-8 pa-8">
    <h3 class="text-2xl font-semibold mb-6">📦 가맹점 재고 신청 내역 (전체)</h3>

    <v-text-field
      v-model="search"
      label="가맹점 이름 검색"
      class="mb-4"
      @keyup.enter="fetchHistories"
    />

    <!-- 💡 v-card로 테이블 감싸기 -->
    <v-card class="rounded-table elevation-1">
      <v-table>
        <thead>
          <tr>
            <th>번호</th>
            <th>가맹점명</th>
            <th>재료명</th>
            <th>수량</th>
            <th>신청일</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in filteredHistories"
            :key="item.historyId"
            @click="goToDetailPage(item)"
            style="cursor: pointer"
          >
            <td>{{ totalElements - (page - 1) * pageSize - index }}</td>
            <td>{{ item.franchiseName }}</td>
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
      @input="fetchHistories"
      class="mt-4"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api'

const router = useRouter()

const histories = ref([])
const loading = ref(false)
const search = ref('')

const page = ref(1)
const pageSize = 10
const totalPages = ref(1)
const totalElements = ref(0)

const fetchHistories = async () => {
  loading.value = true
  try {
    const { data } = await apiClient.get('/franchiseOrder/headquarter/franchise-history-list', {
      params: {
        page: page.value - 1
      }
    })
    histories.value = data.content || []
    totalPages.value = data.totalPages
    totalElements.value = data.totalElements
  } catch (e) {
    console.error('❌ 전체 조회 실패', e)
    alert('조회 실패')
  } finally {
    loading.value = false
  }
}

const filteredHistories = computed(() => {
  if (!search.value.trim()) return histories.value
  return histories.value.filter(h =>
    h.franchiseName?.toLowerCase().includes(search.value.toLowerCase())
  )
})

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString()
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

const goToDetailPage = (item) => {
  if (!item || !item.historyId) {
    console.warn('❌ 잘못된 클릭 항목:', item)
    return
  }

  router.push({
    name: 'stock-history-detail',
    params: {
      historyId: item.historyId
    }
  })
}

onMounted(fetchHistories)
watch(page, fetchHistories)
</script>

<style scoped>
.table-wrapper {
  background-color: #f5f5f5;
}

/* 💡 테이블 상단 둥글게 */
.rounded-table {
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

/* 💡 thead 배경 색 */
::v-deep(.v-table thead) {
  background-color: #D8DBBD;
}
</style>