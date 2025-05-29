<template>
  <div>
    <h3 class="text-2xl font-semibold my-6">📋 가맹점 메뉴 목록</h3>

    <!-- 🔍 검색창 -->
    <div class="d-flex mb-4" style="gap: 8px;">
      <v-text-field
        v-model="search"
        label="메뉴명 검색"
        prepend-inner-icon="mdi-magnify"
        class="flex-grow-1"
        @keyup.enter="handleSearch"
      />
      <v-btn color="success" prepend-icon="mdi-plus" @click="openMenuModal = true">메뉴 추가</v-btn>
    </div>

    <!-- 카테고리 탭 -->
    <v-sheet elevation="6" class="mb-4">
      <v-tabs
        v-model="selectedTab"
        bg-color="#D8DBBD"
        show-arrows
        next-icon="mdi-arrow-right-bold-box-outline"
        prev-icon="mdi-arrow-left-bold-box-outline"
      >
        <v-tab @click="fetchFranchiseMenus">전체</v-tab>
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
        v-for="menu in franchiseMenus"
        :key="menu.menuId"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card class="hoverable">
          <v-img :src="menu.image" aspect-ratio="1" cover />
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
          <v-card-actions class="justify-end">
            <v-btn size="small" color="error" @click="deleteMenu(menu.menuId)">삭제</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- ✅ 페이징 -->
    <v-pagination
      v-if="!selectedCategoryId"
      v-model="page"
      :length="totalPages"
      @input="fetchFranchiseMenus"
      class="mt-4"
    />

    <!-- 메뉴 추가 모달 -->
    <v-dialog v-model="openMenuModal" max-width="700px">
      <v-card>
        <v-card-title class="text-lg font-semibold">📦 본사 메뉴 목록</v-card-title>
        <v-divider />
        <v-card-text>
          <v-data-table
            :headers="menuHeaders"
            :items="currentMenus"
            density="compact"
            hide-default-footer
            no-data-text="등록된 본사 메뉴가 없습니다"
          >
            <template #item.actions="{ item }">
              <v-btn color="primary" size="small" @click="addMenu(item.menuId)">추가</v-btn>
            </template>
          </v-data-table>
          <v-pagination v-model="page" :length="totalPages" class="mt-4" />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="openMenuModal = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import apiClient from '@/api'

const franchiseMenus = ref([])
const headquarterMenus = ref([])
const allCategories = ref([])
const selectedTab = ref(0)
const selectedCategoryId = ref(null)
const openMenuModal = ref(false)
const page = ref(1)
const itemsPerPage = 5
const totalPages = ref(1)
const search = ref('')

// 본사 메뉴 리스트 (모달용)
const currentMenus = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return headquarterMenus.value.slice(start, end)
})

const menuHeaders = [
  { text: '메뉴명', value: 'name' },
  { text: '가격', value: 'price' },
  { text: '동작', value: 'actions', sortable: false }
]

const handleError = (e, message) => {
  const backendMessage = e.response?.data?.message || '알 수 없는 오류가 발생했습니다.'
  alert(`❌ ${message} : ${backendMessage}`)
}

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
    handleError(e, '가맹점 메뉴 불러오기 실패')
  }
}

const fetchMenusByCategory = async (categoryId) => {
  selectedCategoryId.value = categoryId
  try {
    const { data } = await apiClient.get(`/franchise-menus/category/${categoryId}`)
    franchiseMenus.value = data
    totalPages.value = 1
  } catch (e) {
    handleError(e, '카테고리별 메뉴 불러오기 실패')
  }
}

const fetchHeadquarterMenus = async () => {
  const { data } = await apiClient.get('/headquarters/menus', {
    params: { page: 0, size: 1000 }
  })
  headquarterMenus.value = data.content || data
}

const fetchCategories = async () => {
  const { data } = await apiClient.get('/headquarters/categories')
  allCategories.value = data
}

const deleteMenu = async (menuId) => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try {
    await apiClient.delete('/franchise-menus', { data: { menuId } })
    fetchFranchiseMenus()
  } catch (e) {
    handleError(e, '메뉴 삭제 실패')
  }
}

const addMenu = async (menuId) => {
  try {
    await apiClient.post('/franchise-menus', { menuId })
    fetchFranchiseMenus()
    openMenuModal.value = false
  } catch (e) {
    handleError(e, '메뉴 추가 실패')
  }
}

const handleSearch = () => {
  selectedTab.value = 0
  page.value = 1
  fetchFranchiseMenus()
}

onMounted(async () => {
  await fetchCategories()
  await fetchFranchiseMenus()
  await fetchHeadquarterMenus()
})

watch(page, () => {
  if (!selectedCategoryId.value) fetchFranchiseMenus()
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
.category-chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>