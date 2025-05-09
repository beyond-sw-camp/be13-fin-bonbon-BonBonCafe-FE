<template>
    <div>
      <h3>메뉴 조회</h3>
  
      <!-- 🔍 검색창 + 버튼 -->
      <div class="d-flex mb-4" style="gap: 8px;">
        <v-text-field
          v-model="search"
          label="메뉴명 검색"
          prepend-inner-icon="mdi-magnify"
          class="flex-grow-1"
          @keyup.enter="handleSearch"
        />
      </div>
  
      <!-- 카테고리 탭 -->
      <v-sheet elevation="6" class="mb-4">
        <v-tabs
          v-model="selectedTab"
          bg-color="indigo"
          show-arrows
          next-icon="mdi-arrow-right-bold-box-outline"
          prev-icon="mdi-arrow-left-bold-box-outline"
        >
          <v-tab @click="fetchAllMenus">전체</v-tab>
          <v-tab
            v-for="cat in allCategories"
            :key="cat.id"
            @click="fetchMenusByCategory(cat.id)"
          >
            {{ cat.categoryName }}
          </v-tab>
        </v-tabs>
      </v-sheet>
  
      <!-- 메뉴 카드 목록 -->
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
              <div v-if="menu.categories?.length" class="category-chip-container mt-2">
                <v-chip
                  v-for="(cat, index) in menu.categories"
                  :key="index"
                  class="ma-1"
                  color="indigo"
                  text-color="white"
                  label
                  small
                >
                  {{ cat.categoryName }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- ✅ 페이징 -->
      <v-pagination
        v-if="!selectedCategoryId"
        v-model="page"
        :length="totalPages"
        @input="fetchAllMenus"
        class="mt-4"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import apiClient from '@/api'
  
  const route = useRoute()
  const router = useRouter()
  const headquarterId = route.params.headquarterId
  
  const menus = ref([])
  const allCategories = ref([])
  const selectedTab = ref(0)
  const selectedCategoryId = ref(null)
  
  const page = ref(1)
  const totalPages = ref(1)
  const search = ref('') // 🔍 검색어 상태
  
  const fetchAllMenus = async () => {
    selectedCategoryId.value = null
    try {
      const { data } = await apiClient.get(`/headquarters/${headquarterId}/menus`, {
        params: {
          page: page.value - 1,
          search: search.value || null
        }
      })
      menus.value = data.content
      totalPages.value = data.totalPages
      
    } catch (e) {
      console.error('❌ 전체 메뉴 불러오기 실패', e)
    }
  }
  
  const fetchMenusByCategory = async (categoryId) => {
    selectedCategoryId.value = categoryId
    try {
      const { data } = await apiClient.get(`/headquarters/${headquarterId}/categories/${categoryId}/menus`)
      menus.value = data
      totalPages.value = 1
    } catch (e) {
      console.error('❌ 카테고리별 메뉴 불러오기 실패', e)
    }
  }
  
  const goToDetail = (hqId, menuId) => {
    router.push(`/headquarters/${hqId}/menus/${menuId}`)
  }
  
  // 🔍 검색 실행 시 전체탭 + 1페이지로 초기화
  const handleSearch = () => {
    selectedTab.value = 0
    page.value = 1
    fetchAllMenus()
  }
  
  onMounted(async () => {
    const { data } = await apiClient.get(`/headquarters/${headquarterId}/categories`)
    allCategories.value = data
    await fetchAllMenus()
  })
  
  watch(page, () => {
    if (!selectedCategoryId.value) fetchAllMenus()
  })
  </script>
  
  <style scoped>
  .hoverable {
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  .hoverable:hover {
    transform: scale(1.02);
  }
  .category-chip-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  </style>