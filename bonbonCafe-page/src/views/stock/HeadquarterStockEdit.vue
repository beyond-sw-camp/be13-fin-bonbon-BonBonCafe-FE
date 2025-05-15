<template>
    <div>
      <h3>본사 재고 상세</h3>
  
      <v-card v-if="stock" class="pa-4 mt-4">
        <v-card-title>
          {{ stock.ingredientName }}
        </v-card-title>
        <v-card-text>
          <div>📦 수량: {{ stock.quantity }} {{ stock.unit }}</div>
          <div>💰 단가: {{ stock.unitPrice.toLocaleString() }}원</div>
          <div>🛒 소비자가: {{ stock.retailPrice.toLocaleString() }}원</div>
          <div>🏢 본사: {{ stock.headquarterName }}</div>
        </v-card-text>
  
        <!-- ✅ 버튼 -->
        <v-card-actions class="justify-end">
          <v-btn color="blue" @click="goToEdit">수정</v-btn>
          <v-btn color="red" @click="deleteStock">삭제</v-btn>
        </v-card-actions>
      </v-card>
  
      <v-alert
        v-else
        type="warning"
        class="mt-4"
      >
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
  
  const fetchStock = async () => {
    try {
      const { data } = await apiClient.get(`/headquarter-stocks/me/${headquarterStockId}`)
      stock.value = data
    } catch (e) {
      console.error('❌ 재고 단건 조회 실패', e)
    }
  }
  
  // ✅ 수정 버튼
  const goToEdit = () => {
    router.push({
      name: 'headquarter-stock-edit',
      params: {
        headquarterStockId
      }
    })
  }
  
  // ✅ 삭제 버튼
  const deleteStock = async () => {
    try {
      await apiClient.delete(`/headquarter-stocks/me/${headquarterStockId}`)
      alert('삭제되었습니다.')
      router.push({
        name: 'headquarter-stock-list',
        params: {
          headquarterId: stock.value.headquarterId
        }
      })
    } catch (e) {
      console.error('❌ 삭제 실패', e)
      alert('삭제 중 오류가 발생했습니다.')
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