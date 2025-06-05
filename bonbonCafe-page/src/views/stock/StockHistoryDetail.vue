<template>
  <v-container class="py-4" fluid>
    <v-row dense>
      <v-col cols="12" md="6" offset-md="3">
        <v-card class="pa-6" elevation="2" style="width: 100%; height: 650px;">

          <v-typography class="list" align="center">
            재고&발주 관리 / 
          </v-typography>
          <v-typography class="title" align="center">
            재고 신청 상세
          </v-typography>

          <br /><br />

          <v-row dense>
            <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">재료명</div>
              <div class="info-value">{{ history.ingredientName }}</div>
            </v-col>

            <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">수량</div>
              <div class="info-value">
                <template v-if="editMode">
                  <v-text-field v-model="editForm.quantity" type="number" density="compact" hide-details style="max-width: 200px" />
                </template>
                <template v-else>
                  {{ history.quantity }} {{ history.unit || '' }}
                </template>
              </div>
            </v-col>

            <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">신청일</div>
              <div class="info-value">{{ formatDate(history.date) }}</div>
            </v-col>

            <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">상태</div>
              <div class="info-value">
                <template v-if="editMode">
                  <template v-if="['ROLE_HEADQUARTER', 'ROLE_MANAGER'].includes(userRole)">
                    <v-select v-model="editForm.status" :items="statusOptions" item-title="label" item-value="value" dense hide-details style="max-width: 200px" />
                  </template>
                  <template v-else>
                    {{ statusLabel(history.historyStatus) }}
                  </template>
                </template>
                <template v-else>
                  {{ statusLabel(history.historyStatus) }}
                </template>
              </div>
            </v-col>

            <v-divider class="mt-3 mb-4"></v-divider>

            <v-col cols="12" class="d-flex justify-end">
              <template v-if="editMode">
                <v-btn color="primary" class="mr-2" @click="submitUpdate">수정 완료</v-btn>
                <v-btn variant="outlined" @click="cancelEdit">취소</v-btn>
              </template>
              <template v-else>
                <v-btn color="primary" class="mr-2" @click="tryEdit">수정</v-btn>
                <v-btn color="error" variant="outlined" @click="deleteHistory">삭제</v-btn>
              </template>
            </v-col>
          </v-row>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '@/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const userRole = computed(() => authStore.userInfo.role)

const route = useRoute()
const router = useRouter()
const historyId = route.params.historyId

const history = ref({})
const editForm = ref({ ingredientId: null, quantity: 0, status: '' })
const editMode = ref(false)

const statusOptions = [
  { value: 'REQUESTED', label: '신청 완료' },
  { value: 'APPROVED', label: '승인 완료' },
  { value: 'REJECTED', label: '승인 거부' },
  { value: 'SHIPPED', label: '배송 진행 중' },
  { value: 'DELIVERED', label: '배송 완료' },
  // { value: 'CANCELLED', label: '신청 취소' }
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
    const msg = e.response?.data?.message || '조회에 실패했습니다.'
    alert(msg)
  }
}
// const cancelOnlyOption = [{ value: 'CANCELLED', label: '신청 취소' }]
const tryEdit = () => {
  const status = history.value.historyStatus

  if (userRole.value === 'ROLE_FRANCHISEE' && status !== 'REQUESTED') {
    alert(`${statusLabel(status)} 상태일 경우 수정하실 수 없습니다.`)
    return
  }

  if (userRole.value === 'ROLE_HEADQUARTER' && ['DELIVERED', 'REJECTED', 'CANCELLED'].includes(status)) {
    alert(`${statusLabel(status)} 상태일 경우 수정하실 수 없습니다.`)
    return
  }

  editMode.value = true
}

const submitUpdate = async () => {
  try {
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
  const status = history.value.historyStatus

  if (userRole.value === 'ROLE_FRANCHISEE' && status !== 'REQUESTED') {
    alert(`${statusLabel(status)} 상태일 경우 삭제하실 수 없습니다.`)
    return
  }

  if (userRole.value === 'ROLE_HEADQUARTER' && ['DELIVERED', 'REJECTED', 'CANCELLED'].includes(status)) {
    alert(`${statusLabel(status)} 상태일 경우 삭제하실 수 없습니다.`)
    return
  }

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
    REQUESTED: '신청 완료',
    APPROVED: '승인 완료',
    REJECTED: '승인 거부',
    SHIPPED: '배송 진행 중',
    DELIVERED: '배송 완료',
    // CANCELLED: '신청 취소'
  }
  return map[status] || status
}

onMounted(fetchDetail)
</script>

<style scoped>
.info-label {
  font-size: 14px;
  color: #888;
  margin-bottom: 4px;
}

.info-value {
  font-size: 16px;
  font-weight: 500;
  color: #222;
}

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
</style>