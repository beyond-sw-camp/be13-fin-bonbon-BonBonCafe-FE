<template>
  <div>
    <h3>📄 재고 신청 상세</h3>

    <v-card class="pa-4 mb-4">
      <div><strong>재료명:</strong> {{ history.ingredientName }}</div>
      <div><strong>수량:</strong>
        <span v-if="!editMode">{{ history.quantity }}</span>
        <v-text-field
          v-else
          v-model="editForm.quantity"
          type="number"
          dense
        />
      </div>
      <div><strong>신청일:</strong> {{ formatDate(history.date) }}</div>
      <div><strong>상태:</strong>
        <span v-if="!editMode">{{ statusLabel(history.historyStatus) }}</span>
        <v-select
          v-else
          v-model="editForm.status"
          :items="statusOptions"
          item-title="label"
          item-value="value"
          dense
        />
      </div>
    </v-card>

    <div class="d-flex justify-end" style="gap: 8px">
      <template v-if="editMode">
        <v-btn color="primary" @click="submitUpdate">수정 완료</v-btn>
        <v-btn @click="cancelEdit">취소</v-btn>
      </template>
      <template v-else>
        <v-btn color="primary" @click="editMode = true">수정</v-btn>
        <v-btn color="error" @click="deleteHistory">삭제</v-btn>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '@/api'

const route = useRoute()
const router = useRouter()
const headquarterId = route.params.headquarterId || 1
const franchiseId = route.params.franchiseId || 24
const historyId = route.params.historyId

const history = ref({})
const editForm = ref({ ingredientId: null, quantity: 0, status: '' })
const editMode = ref(false)

// ✅ 한글 드롭다운용 상태 목록
const statusOptions = [
  { value: 'REQUESTED', label: '신청됨' },
  { value: 'APPROVED', label: '승인됨' },
  { value: 'REJECTED', label: '거절됨' },
  { value: 'SHIPPED', label: '배송 중' },
  { value: 'DELIVERED', label: '배송 완료' },
  { value: 'CANCELLED', label: '취소됨' }
]

const fetchDetail = async () => {
  try {
    const { data } = await apiClient.get(`/franchiseOrder/history/${historyId}`)
    history.value = data
    editForm.value = {
      ingredientId: data.ingredientId,
      quantity: data.quantity,
      status: data.historyStatus
    }
  } catch (e) {
    console.error('❌ 상세 조회 실패', e)
    alert('조회에 실패했습니다.')
  }
}

const submitUpdate = async () => {
  try {
    console.log('📦 수정요청', {
      headquarterId,
      franchiseId,
      historyId,
      ingredientId: editForm.value.ingredientId,
      quantity: editForm.value.quantity,
      status: editForm.value.status
    })

    await apiClient.put(`/franchiseOrder/${historyId}`, {
      ingredientId: editForm.value.ingredientId,
      quantity: editForm.value.quantity,
      status: editForm.value.status
    })
    alert('수정 완료')
    editMode.value = false
    await fetchDetail()
  } catch (e) {
    console.error('❌ 수정 실패', e)
    alert(`수정 실패: ${e.response?.data?.message || e.message}`)
  }
}

const cancelEdit = () => {
  editMode.value = false
  editForm.value = {
    ingredientId: history.value.ingredientId,
    quantity: history.value.quantity,
    status: history.value.historyStatus
  }
}

const deleteHistory = async () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    try {
      await apiClient.delete(`/franchiseOrder/${historyId}`)
      alert('삭제되었습니다')
      router.push({ name: 'stock-order-history' })
    } catch (e) {
      console.error('❌ 삭제 실패', e)
      alert(`삭제 실패: ${e.response?.data?.message || e.message}`)
    }
  }
}

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString()
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

onMounted(fetchDetail)
</script>