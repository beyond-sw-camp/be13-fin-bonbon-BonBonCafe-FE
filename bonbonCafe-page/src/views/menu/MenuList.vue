<template>
    <div>
      <h3>메뉴 조회</h3>
  
      <v-row>
        <v-col
          v-for="menu in menus"
          :key="menu.menuId"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card class="hoverable" @click="goToDetail(menu.headquarterId, menu.menuId)">
            <v-img :src="menu.image" height="150" cover />
            <v-card-title>{{ menu.name }}</v-card-title>
            <v-card-subtitle>{{ menu.price }}원</v-card-subtitle>
            <v-card-text>
              {{ menu.description }}
              <div v-if="menu.categories && menu.categories.length" class="mt-2">
                <v-chip
                  v-for="(cat, index) in menu.categories"
                  :key="index"
                  class="ma-1"
                  color="primary"
                  label
                  size="small"
                >
                  {{ cat.categoryName }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <v-pagination
        v-model="page"
        :length="totalPages"
        class="mt-4"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import apiClient from '@/api'
  
  const menus = ref([])
  const totalPages = ref(1)
  const page = ref(1)
  
  const route = useRoute()
  const router = useRouter()
  const headquarterId = route.params.headquarterId
  
  const fetchMenus = async () => {
    try {
      const { data } = await apiClient.get(`/headquarters/${headquarterId}/menus`, {
        params: { page: page.value - 1 } // Spring은 0부터 시작
      })
      menus.value = data.content
      totalPages.value = data.totalPages
      console.log('📦 페이지:', page.value, '총 페이지:', data.totalPages)
    } catch (err) {
      console.error('❌ 메뉴 목록 요청 실패:', err)
    }
  }
  
  const goToDetail = (hqId, menuId) => {
    router.push(`/headquarters/${hqId}/menus/${menuId}`)
  }
  
  // 초기 데이터 로딩
  onMounted(fetchMenus)
  
  // 페이지 변경 시마다 새로 불러오기
  watch(page, fetchMenus)
  </script>
  
  <style scoped>
  .hoverable {
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  .hoverable:hover {
    transform: scale(1.02);
  }
  </style>