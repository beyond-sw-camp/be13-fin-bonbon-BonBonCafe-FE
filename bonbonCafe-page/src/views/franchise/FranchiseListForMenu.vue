<template>
    <div class="p-4">
      <h3 class="text-xl font-semibold mb-4">📍 가맹점 목록</h3>
  
      <v-data-table
        :headers="headers"
        :items="franchiseList"
        class="elevation-1"
        item-value="franchiseId"
        @click:row="handleRowClick"
      >
        <template #item.franchiseId="{ item }">
          #{{ item.franchiseId }}
        </template>
      </v-data-table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import apiClient from '@/api'
  
  const router = useRouter()
  const franchiseList = ref([])
  
  const headers = [
    { text: 'ID', value: 'franchiseId' },
    { text: '가맹점 이름', value: 'name' }
  ]
  
  // ✅ 이벤트 핸들러 수정
  const handleRowClick = (event, { item }) => {
    console.log('✅ 클릭한 아이템:', item)
    if (!item?.franchiseId) {
      alert('franchiseId 없음!')
      return
    }
    router.push(`/headquarters/franchise-menu-list/${item.franchiseId}`)
  }
  
  onMounted(async () => {
    try {
      const { data } = await apiClient.get('/franchise', {
        params: {
          page: 0,
          size: 1000
        }
      })
      franchiseList.value = data.franchises
    } catch (e) {
      console.error('가맹점 목록 불러오기 실패', e)
    }
  })
  </script>