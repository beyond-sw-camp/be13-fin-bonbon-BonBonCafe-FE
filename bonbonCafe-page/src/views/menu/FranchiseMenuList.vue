<template>
    <div class="px-4">
      <h3 class="text-2xl font-semibold my-6">📋 가맹점 메뉴 목록</h3>
  
      <!-- 메뉴 추가 버튼 -->
      <div class="flex justify-end mb-4">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openMenuModal = true">
          메뉴 추가
        </v-btn>
      </div>
  
      <!-- 📋 메뉴 카드 목록 -->
      <v-row>
        <v-col v-for="menu in franchiseMenus" :key="menu.menuId" cols="12" sm="6" md="4">
          <v-card class="hoverable">
            <v-card-title class="text-lg font-semibold">
              {{ menu.name }}
            </v-card-title>
            <v-card-subtitle>{{ menu.price }}원</v-card-subtitle>
            <v-card-text>
              {{ menu.description }}
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn size="small" color="error" @click="deleteMenu(menu.menuId)">삭제</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- 본사 메뉴 선택 모달 (테이블 형식) -->
      <v-dialog v-model="openMenuModal" max-width="700px">
        <v-card>
          <v-card-title class="text-lg font-semibold">📦 본사 메뉴 목록</v-card-title>
          <v-divider />
          <v-card-text>
            <v-data-table
              :headers="menuHeaders"
              :items="headquarterMenus"
              :items-per-page="5"
              class="rounded"
              no-data-text="등록된 본사 메뉴가 없습니다"
            >
              <template #item.actions="{ item }">
                <v-btn color="primary" size="small" @click="addMenu(item.menuId)">추가</v-btn>
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn variant="text" @click="openMenuModal = false">닫기</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import apiClient from '@/api'
  
  const franchiseMenus = ref([])
  const headquarterMenus = ref([])
  const openMenuModal = ref(false)
  
  const headers = [
    { text: '메뉴명', value: 'name' },
    { text: '가격', value: 'price' },
    { text: '상태', value: 'status' },
    { text: '동작', value: 'actions', sortable: false },
  ]
  
  const menuHeaders = [
    { text: '메뉴명', value: 'name' },
    { text: '가격', value: 'price' },
    { text: '동작', value: 'actions', sortable: false },
  ]
  
  const fetchFranchiseMenus = async () => {
    const { data } = await apiClient.get('/franchise-menus')
    franchiseMenus.value = data.content || data
  }
  
  const fetchHeadquarterMenus = async () => {
    const { data } = await apiClient.get('/headquarters/menus', {
      params: {
        page: 0,
        size: 1000 // 충분히 크게 설정해서 전체 가져오기
      }
    })
    headquarterMenus.value = data.content || data
  }
  
  const addMenu = async (menuId) => {
    try {
      await apiClient.post('/franchise-menus', { menuId })
      fetchFranchiseMenus()
      openMenuModal.value = false
    } catch (e) {
      console.error('❌ 추가 실패', e)
    }
  }
  
  const deleteMenu = async (menuId) => {
    try {
      await apiClient.delete('/franchise-menus', { data: { menuId } })
      fetchFranchiseMenus()
    } catch (e) {
      console.error('❌ 삭제 실패', e)
    }
  }
  
  onMounted(() => {
    fetchFranchiseMenus()
    fetchHeadquarterMenus()
  })
  </script>
  
  <style scoped>
  .hoverable {
    transition: transform 0.2s ease;
    cursor: pointer;
  }
  .hoverable:hover {
    transform: scale(1.02);
  }
  </style>