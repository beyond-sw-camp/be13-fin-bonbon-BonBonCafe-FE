<template>
    <div class="p-6">
      <h3 class="text-xl font-semibold mb-4">🏢 내 본사 정보</h3>
      <v-card class="pa-4">
        <p><strong>이름:</strong> {{ info.name }}</p>
        <p><strong>전화번호:</strong> {{ info.headquarterTel }}</p>
        <p><strong>주소:</strong> {{ info.roadAddress }} {{ info.detailAddress }}</p>
        <p><strong>생성일:</strong> {{ info.createTime }}</p>
        <p><strong>수정일:</strong> {{ info.modifyAt }}</p>
      </v-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import apiClient from '@/api'
  
  const info = ref({})
  
  onMounted(async () => {
    const { data } = await apiClient.get('/headquarters')
    info.value = data
  })
  </script>