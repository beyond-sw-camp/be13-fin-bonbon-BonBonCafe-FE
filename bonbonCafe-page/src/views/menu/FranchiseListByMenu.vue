<template>
    <v-container>
      <h2 class="text-h5 font-weight-bold mb-4">📋 해당 메뉴를 판매 중인 가맹점 목록</h2>
  
      <v-table>
        <thead>
          <tr>
            <th>가맹점명</th>
            <th>주소</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="f in franchises" :key="f.franchiseId">
            <td>{{ f.name }}</td>
            <td>{{ f.address }}</td>
          </tr>
        </tbody>
      </v-table>
  
      <div class="mt-4">
        <v-btn @click="goBack" color="secondary">뒤로가기</v-btn>
      </div>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import apiClient from '@/api'
  
  const route = useRoute()
  const router = useRouter()
  const menuId = route.params.menuId
  const franchises = ref([])
  
  const fetchFranchises = async () => {
    try {
      const { data } = await apiClient.get(`/franchise-menus/menu/${menuId}/franchises`)
      franchises.value = data
    } catch (e) {
      console.error('❌ 가맹점 목록 조회 실패', e)
    }
  }
  
  const formatDate = (date) => new Date(date).toLocaleDateString()
  
  const goBack = () => {
    router.back()
  }
  
  onMounted(fetchFranchises)
  </script>
  
  <style scoped>
  .v-table {
    margin-bottom: 24px;
  }
  </style>