<template>
  <div class="stock-detail-wrapper ma-10 pa-8">
    <h3 class="text-2xl font-semibold mb-6">📦 본사 재고 상세</h3>

    <v-card v-if="stock" class="stock-card elevation-1 pa-6">
      <v-card-title class="text-xl font-semibold mb-4">
        {{ stock.ingredientName }}
      </v-card-title>

      <v-card-text class="text-base">
        <div class="mb-3">
          <strong>📦 수량:</strong>
          <span v-if="!editMode">{{ stock.quantity }} {{ stock.unit }}</span>
          <v-text-field
            v-else
            v-model="editForm.quantity"
            type="number"
            hide-details
            density="compact"
            class="mt-2"
          />
        </div>
        <div class="mb-2">💰 <strong>단가:</strong> {{ formatPrice(stock.unitPrice) }}원</div>
        <div class="mb-2">🛒 <strong>소비자가:</strong> {{ formatPrice(stock.retailPrice) }}원</div>
        <div class="mt-2 text-caption text-grey-darken-1">🏢 본사: {{ stock.headquarterName }}</div>
      </v-card-text>

      <!-- ✅ 버튼 영역 -->
      <v-card-actions class="justify-end mt-4" style="gap: 8px;">
        <template v-if="editMode">
          <v-btn color="#D8DBBD" variant="flat" @click="submitUpdate">수정 완료</v-btn>
          <v-btn variant="text" @click="cancelEdit">취소</v-btn>
        </template>
        <template v-else>
          <v-btn color="primary" @click="editMode = true">수정</v-btn>
          <v-btn color="error" @click="deleteStock">삭제</v-btn>
        </template>
      </v-card-actions>
    </v-card>

    <v-alert v-else type="warning" class="mt-6" variant="outlined">
      재고 정보를 불러오지 못했습니다.
    </v-alert>
  </div>
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
</style>