<template>
    <div>
      <h3>📦 재고 신청 내역</h3>
  
      <v-table>
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
  
  const headquarterId = route.params.headquarterId || 1
  const franchiseId = route.params.franchiseId || 24 // 하드코딩
  
  const page = ref(1)
  const pageSize = 10
  const totalPages = ref(1)
  const totalElements = ref(0)
  const histories = ref([])
  
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
  
  const goToDetail = (historyId) => {
    if (!historyId) return
    router.push({
      name: 'stock-history-detail',
      params: {
        headquarterId,
        franchiseId,
        historyId
      }
    })
  }
  
  onMounted(fetchHistory)
  watch(page, fetchHistory)
  </script>
  
  <style scoped>
  h3 {
    margin-bottom: 16px;
  }
  </style>