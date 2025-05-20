<template>
  <div>
    <h3>본사 재고 상세</h3>

    <v-card v-if="stock" class="pa-4 mt-4">
      <v-card-title>{{ stock.ingredientName }}</v-card-title>

      <v-card-text>
        <div>
          <strong>📦 수량:</strong>
          <span v-if="!editMode">{{ stock.quantity }} {{ stock.unit }}</span>
          <v-text-field
            v-else
            v-model="editForm.quantity"
            type="number"
            dense
          />
        </div>

        <div><strong>💰 단가:</strong> {{ stock.unitPrice.toLocaleString() }}원</div>
        <div><strong>🛒 소비자가:</strong> {{ stock.retailPrice.toLocaleString() }}원</div>
        <div><strong>🏢 본사:</strong> {{ stock.headquarterName }}</div>
      </v-card-text>

      <!-- ✅ 수정/삭제/취소 버튼 -->
      <v-card-actions class="justify-end" style="gap: 8px;">
        <template v-if="editMode">
          <v-btn color="primary" @click="submitUpdate">수정 완료</v-btn>
          <v-btn @click="cancelEdit">취소</v-btn>
        </template>
        <template v-else>
          <v-btn color="primary" @click="editMode = true">수정</v-btn>
          <v-btn color="error" @click="deleteStock">삭제</v-btn>
        </template>
      </v-card-actions>
    </v-card>

    <v-alert v-else type="warning" class="mt-4">
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
      router.push({
        name: 'headquarter-stock-list',
        params: { headquarterId: stock.value.headquarterId }
      })
    } catch (e) {
      console.error('❌ 삭제 실패', e)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }
}

onMounted(fetchStock)
</script>

<style scoped>
.v-card {
  max-width: 600px;
  margin: 0 auto;
}
</style>