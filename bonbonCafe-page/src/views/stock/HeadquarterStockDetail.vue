<template>
  <v-container class="py-4 hei" fluid>
    <v-row dense>
      <v-col cols="12" md="6" offset-md="3">
        <v-card class="pa-6" elevation="2" style="width: 100%; height: 650px;">

          <v-typography class="list" align="center">
            재고&발주 관리 /
          </v-typography>
          <v-typography class="title" align="center">
            본사 재고 상세
          </v-typography>

          <br /><br />

          <v-row dense>
            <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">재료명</div>
              <div class="info-value">{{ stock?.ingredientName }}</div>
            </v-col>

            <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">수량</div>
              <div class="info-value">
                <template v-if="editMode">
                  <v-text-field v-model="editForm.quantity" type="number" density="compact" hide-details
                    style="max-width: 200px" />
                </template>
                <template v-else>
                  {{ stock?.quantity }} {{ stock?.unit }}
                </template>
              </div>
            </v-col>

            <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">단가</div>
              <div class="info-value">{{ formatPrice(stock?.unitPrice) }}원</div>
            </v-col>

            <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">소비자가</div>
              <div class="info-value">{{ formatPrice(stock?.retailPrice) }}원</div>
            </v-col>

            <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">본사</div>
              <div class="info-value">{{ stock?.headquarterName }}</div>
            </v-col>

            <v-divider class="mt-3 mb-4"></v-divider>

            <v-col cols="12" class="d-flex justify-end">
              <template v-if="editMode">
                <v-btn color="primary" class="mr-2" @click="submitUpdate">수정 완료</v-btn>
                <v-btn variant="outlined" @click="cancelEdit">취소</v-btn>
              </template>
              <template v-else>
                <v-btn variant="text" color="primary" @click="goToList" class="mb-4">
                  <v-icon start>mdi-arrow-left</v-icon>
                  재고 목록으로
                </v-btn>
                <v-btn color="primary" class="mr-2" @click="editMode = true">수정</v-btn>
                <v-btn color="error" variant="outlined" @click="deleteStock">삭제</v-btn>
              </template>
            </v-col>
          </v-row>
        </v-card>

        <v-alert v-if="!stock" type="warning" class="mt-6" variant="outlined">
          재고 정보를 불러오지 못했습니다.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '@/api'

const route = useRoute()
const router = useRouter()
const headquarterStockId = route.params.headquarterStockId

const stock = ref(null)
const editForm = ref({ quantity: 0 })
const editMode = ref(false)

const fetchStock = async () => {
  try {
    const { data } = await apiClient.get(`/headquarter-stocks/me/${headquarterStockId}`)
    stock.value = data
    editForm.value.quantity = data.quantity
  } catch (e) {
    console.error('❌ 재고 단건 조회 실패', e)
  }
}

const submitUpdate = async () => {
  try {
    await apiClient.put(`/headquarter-stocks/me/${headquarterStockId}`, {
      ingredientId: stock.value.ingredientId,
      quantity: editForm.value.quantity
    })
    alert('수정 완료')
    editMode.value = false
    await fetchStock()
  } catch (e) {
    console.error('❌ 수정 실패', e)
    alert('수정 중 오류가 발생했습니다.')
  }
}

const cancelEdit = () => {
  editMode.value = false
  editForm.value.quantity = stock.value.quantity
}

const deleteStock = async () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    try {
      await apiClient.delete(`/headquarter-stocks/me/${headquarterStockId}`)
      alert('삭제되었습니다')
      router.push({ name: 'headquarter-stock-list', params: { headquarterId: stock.value.headquarterId } })
    } catch (e) {
      console.error('❌ 삭제 실패', e)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }
}
const goToList = () => {
  router.push({ name: 'headquarter-stock-list' })
}
const formatPrice = (price) => price ? Number(price).toLocaleString() : '-'

onMounted(fetchStock)
</script>

<style scoped>
.stock-detail-wrapper {
  background-color: #f5f5f5;
}

.stock-card {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 12px;
}

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

.hei {
  min-height: 900px;
}
</style>