<template>
  <v-container class="menu-card pa-3">
    <!-- 상단 제목 및 검색창 -->
    <v-row class="align-center mb-6" justify="space-between">
      <v-col cols="auto" class="d-flex align-center">
        <v-text class="text-h5" style="color: #888; margin-right: 8px;">메뉴 관리</v-text>
        <v-text class="text-body-2" style="color: #888;">/</v-text>
        <v-text class="text-h4 font-weight-bold" style="color: #2A3663; margin-left: 8px;">
          <span style="font-size: 1.3rem; margin-right: 6px;">🎉</span> 가맹점 메뉴 조회
        </v-text>
      </v-col>

      <v-col cols="auto" style="max-width: 400px;">
        <v-text-field
          v-model="search"
          placeholder="메뉴명 검색"
          append-inner-icon="mdi-magnify"
          clearable
          density="comfortable"
          variant="outlined"
          class="search-input"
          hide-details
          @keyup.enter="handleSearch"
          @click:append-inner="handleSearch"
        />
      </v-col>
    </v-row>

    <!-- 카테고리 탭 -->
    <v-sheet elevation="6" class="mb-4 rounded-t-lg custom-tabs">
      <v-tabs 
        v-model="selectedTab" 
        bg-color="#f4faff"
        height="58"
        show-arrows
        class="rounded-t-lg"
      >
        <v-tab @click="fetchFranchiseMenus" class="custom-tab">전체</v-tab>
        <v-tab 
          v-for="cat in allCategories" 
          :key="cat.id" 
          @click="fetchMenusByCategory(cat.id)" 
          class="custom-tab"
        >
          {{ cat.categoryName }}
        </v-tab>
      </v-tabs>
    </v-sheet>

    <!-- 메뉴 카드 목록 -->
    <v-row dense>
      <v-col
        v-for="menu in franchiseMenus"
        :key="menu.menuId"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="d-flex"
      >
        <v-card
          class="hoverable w-100 d-flex flex-column"
          elevation="4"
          rounded
          @click="goToDetail(menu.menuId)"
        >
          <div style="position: relative;">
            <v-img
              :src="menu.image || '/default-menu.png'"
              aspect-ratio="1"
              class="hover-image rounded-top"
              cover
            />
            <v-chip
              v-if="menu.status"
              :color="menu.status === 'ACTIVE' ? 'green' : 'grey'"
              text-color="white"
              x-small
              rounded
              class="status-chip-inside-img"
            >
              {{ menu.status === 'ACTIVE' ? '활성화' : '비활성화' }}
            </v-chip>
          </div>

          <v-card-title class="py-3 px-4 text-center font-weight-bold" style="justify-content: center; font-size: 1.1rem; color: #2A3663;">
            {{ menu.name }}
          </v-card-title>

          <v-divider class="mx-4 my-1"></v-divider>

          <v-card-text class="px-4 pb-4 pt-2 text-body-2" style="flex-grow: 1; color: #5a5a5a; display: flex; flex-direction: column;">
            <div class="mb-2" style="min-height: 3.2em;">
              {{ menu.description }}
            </div>

            <div style="flex-grow: 1;">
              <div v-if="menu.categories?.length" class="category-chip-container">
                <v-chip
                  v-for="(cat, index) in menu.categories"
                  :key="index"
                  class="ma-1"
                  color="deep-purple accent-4"
                  text-color="white"
                  label
                  small
                  rounded
                >
                  #{{ cat.categoryName }}
                </v-chip>
              </div>
            </div>

            <div class="price mt-3" style="font-weight: 600; color: #4a4a4a; text-align: right;">
              💰 {{ menu.price.toLocaleString() }}원
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 페이징 -->
    <v-pagination
      v-if="!selectedCategoryId"
      v-model="page"
      :length="totalPages"
      @update:model-value="fetchFranchiseMenus"
      class="mt-6 custom-pagination"
      color="#2A3663"
    />
  </v-container>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api'

const router = useRouter()

const franchiseMenus = ref([])
const allCategories = ref([])
const selectedTab = ref(0)
const selectedCategoryId = ref(null)
const page = ref(1)
const totalPages = ref(1)
const search = ref('')

// 메뉴 상세 이동
const goToDetail = (menuId) => {
  router.push({ name: 'menu-detail', params: { menuId } })
}

// 전체 메뉴 조회
const fetchFranchiseMenus = async () => {
  selectedCategoryId.value = null
  try {
    const { data } = await apiClient.get('/franchise-menus', {
      params: {
        page: page.value - 1,
        search: search.value || null
      }
    })
    franchiseMenus.value = data.content || data
    totalPages.value = data.totalPages || 1
  } catch (e) {
    console.error('❌ 가맹점 메뉴 불러오기 실패', e)
  }
}

// 카테고리 메뉴 조회
const fetchMenusByCategory = async (categoryId) => {
  selectedCategoryId.value = categoryId
  try {
    const { data } = await apiClient.get(`/franchise-menus/category/${categoryId}`)
    franchiseMenus.value = data
    totalPages.value = 1
  } catch (e) {
    console.error('❌ 카테고리별 메뉴 불러오기 실패', e)
  }
}

// 검색 실행
const handleSearch = () => {
  selectedTab.value = 0
  page.value = 1
  fetchFranchiseMenus()
}

// 초기 로딩
onMounted(async () => {
  const { data } = await apiClient.get('/headquarters/categories')
  allCategories.value = data
  await fetchFranchiseMenus()
})

// 페이지 변경 시
watch(page, () => {
  if (!selectedCategoryId.value) fetchFranchiseMenus()
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
.menu-card {
  max-width: 1300px;
  min-height: 900px;
  margin: 40px auto;
  border-radius: 16px;
}

.category-chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.hover-image {
  transition: 0.3s ease;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.v-card:hover .hover-image {
  transform: scale(1.05);
}

.hoverable {
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.hoverable:hover {
  box-shadow: 0 8px 20px rgba(65, 66, 136, 0.15);
  background-color: rgb(237, 247, 255);
}

.custom-pagination >>> .v-pagination__item.v-pagination__item--is-active {
  background-color: #caddf0 !important;
  color: white !important;
  font-weight: bold;
  border-radius: 8px;
}

.search-input {
  background-color: white;
  width: 200px;
}

.custom-tabs {
  box-shadow: inset 0 -2px 4px rgb(0 0 0 / 0.1);
}

.custom-tab {
  margin: 0 8px;
  padding: 0 16px;
  color: #2A3663;
  font-weight: 500;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
}

.custom-tab:hover {
  background-color: #e3f2fd;
  color: #1e3a8a;
  transform: scale(1.1);
}

.status-chip-inside-img {
  position: absolute;
  bottom: 8px;
  right: 8px;
  z-index: 1;
  opacity: 0.9;
}
</style>