<template>
    <div class="p-6 headquarter-wrapper">
      <h3 class="text-2xl font-bold mb-6 text-center">🏢 내 본사 정보</h3>
  
      <v-card class="pa-6 info-card elevation-2">
        <v-row dense>
          <v-col cols="12">
            <p><strong>👤 이름:</strong> {{ info.name }}</p>
          </v-col>
          <v-col cols="12">
            <p><strong>📞 전화번호:</strong> {{ info.headquarterTel }}</p>
          </v-col>
          <v-col cols="12">
            <p><strong>📍 주소:</strong> {{ info.roadAddress }} {{ info.detailAddress }}</p>
          </v-col>
          <v-col cols="12">
            <p><strong>🕓 생성일:</strong> {{ formatDate(info.createTime) }}</p>
          </v-col>
          <v-col cols="12">
            <p><strong>🛠 수정일:</strong> {{ formatDate(info.modifyAt) }}</p>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import apiClient from '@/api'
  
  const info = ref({})
  
  const formatDate = (datetime) => {
    return datetime ? new Date(datetime).toLocaleString() : '-'
  }
  
  onMounted(async () => {
    const { data } = await apiClient.get('/headquarters')
    info.value = data
  })
  </script>
  
  <style scoped>
  .headquarter-wrapper {
    background-color: #f9f9f9;
    border-radius: 12px;
    max-width: 70%;
    margin: 0 auto;
  }
  
  .info-card {
    border-radius: 12px;
    background-color: white;
  }
  </style>