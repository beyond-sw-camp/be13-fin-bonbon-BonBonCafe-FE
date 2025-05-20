<template>
    <div>
      <h3>🍽️ 선택한 가맹점의 메뉴</h3>
      <v-data-table :items="menus" :headers="headers" />
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import apiClient from '@/api'
  
  const route = useRoute()
  const menus = ref([])
  
  const headers = [
    { text: '메뉴명', value: 'name' },
    { text: '가격', value: 'price' },
  ]
  
  onMounted(async () => {
    const franchiseId = route.params.franchiseId
    const { data } = await apiClient.get(`/franchise-menus/franchise/${franchiseId}`)
    menus.value = data.content || data
  })
  </script>