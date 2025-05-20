<template>
    <div>
      <h3>➕ 본사 재고 추가</h3>
  
      <v-form @submit.prevent="submitStock">
        <!-- ✅ 재료 선택 -->
        <v-select
  v-model="form.ingredientId"          
  :items="ingredientOptions"
  item-title="ingredientName"         
  item-value="ingredientId"           
  label="재료 선택"
  required
/>
  
        <!-- ✅ 수량 입력 -->
        <v-text-field
          v-model="form.quantity"
          label="수량"
          type="number"
          required
        />
  
        <!-- ✅ 제출 버튼 -->
        <div class="d-flex justify-end mt-4" style="gap: 8px">
          <v-btn type="submit" color="primary">등록</v-btn>
          <v-btn @click="cancel">취소</v-btn>
        </div>
      </v-form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import apiClient from '@/api'
  
  const router = useRouter()
  
  const form = ref({
    ingredientId: null,
    quantity: 0
  })
  
  const ingredientOptions = ref([])
  
  // ✅ 본사 재료 목록 불러오기
  const fetchIngredients = async () => {
  try {
    const { data } = await apiClient.get('/ingredients')
    ingredientOptions.value = data.map(item => ({
  ingredientId: item.ingredientId,
  ingredientName: `${item.ingredientName} (${item.unit})`
}))
  } catch (e) {
    console.error('❌ 재료 목록 조회 실패', e)
  }
}
  
const submitStock = async () => {
  try {
    await apiClient.post('/headquarter-stocks/me', {
      ingredientId: form.value.ingredientId,
      quantity: form.value.quantity
    })
    alert('재고가 등록되었습니다.')
    router.push({ name: 'headquarter-stock-list' })
  } catch (e) {
    console.error('❌ 재고 등록 실패', e)
    alert(e.response?.data?.message || '등록 중 오류 발생')
  }
}
  
  const cancel = () => {
    router.push({ name: 'headquarter-stock-list' })
  }
  
  onMounted(fetchIngredients)
  </script>
  
  <style scoped>
  .v-form {
    max-width: 500px;
    margin: 0 auto;
  }
  </style>
  