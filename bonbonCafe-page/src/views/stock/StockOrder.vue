<template>
  <div>
    <h3>재고 주문</h3>
    <v-form @submit.prevent="submitRequest">
      <v-select
        v-model="selectedIngredient"
        :items="ingredients"
        item-title="ingredientName"
        item-value="ingredientId"
        label="재료 선택"
        required
      />
      <v-text-field
        v-model="quantity"
        type="number"
        label="수량"
        required
      />
      <v-btn color="primary" type="submit">등록</v-btn>
    </v-form>
  </div>
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
    // ✅ 본사에 등록된 재료만 조회
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
</script>