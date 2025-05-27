<template>
  <v-card class="pa-8 ma-16 request-form-card elevation-1">
    <h3 class="text-2xl font-semibold mb-6">📦 재고 주문</h3>

    <v-form @submit.prevent="submitRequest" class="d-flex flex-column gap-4">
      <v-select
        v-model="selectedIngredient"
        :items="ingredients"
        item-title="ingredientName"
        item-value="ingredientId"
        label="재료 선택"
        variant="outlined"
        density="comfortable"
        required
      />
      <v-text-field
        v-model="quantity"
        type="number"
        label="수량"
        variant="outlined"
        density="comfortable"
        :rules="[v => v <= 999999 || '수량은 최대 999999까지 입력할 수 있어요.']"
        @input="onQuantityInput"
        required
      />
      <div class="d-flex justify-end">
        <v-btn type="submit" class="submit-btn" elevation="0">등록</v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '@/api'

const route = useRoute()
const router = useRouter()

const ingredients = ref([])
const selectedIngredient = ref(null)
const quantity = ref(0)

onMounted(async () => {
  try {
    const res = await apiClient.get(`/headquarter-stocks/ingredients`)
    ingredients.value = res.data
  } catch (e) {
    console.error('❌ 본사 재고 재료 조회 실패', e)
  }
})

const submitRequest = async () => {
  if (!selectedIngredient.value) {
    alert('재료를 선택해주세요.')
    return
  }

  try {
    await apiClient.post(`/franchiseOrder`, {
      ingredientId: selectedIngredient.value,
      quantity: quantity.value,
      status: 'REQUESTED'
    })
    alert('신청 완료!')
    router.back()
  } catch (error) {
    const message = error.response?.data?.message || '알 수 없는 오류가 발생했습니다.'
    alert(`❌ 신청 실패: ${message}`)
  }
}

const onQuantityInput = (e) => {
  const val = Number(e.target.value)
  if (val > 999999) {
    quantity.value = 999999
  }
}
</script>

<style scoped>
.request-form-card {
  background-color: #f9f9f9;
  border-radius: 12px;
}

.submit-btn {
  background-color: #D8DBBD;
  color: #333;
}
</style>