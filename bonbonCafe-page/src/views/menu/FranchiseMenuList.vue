<template>
  <div>
    <h3>📋 가맹점 메뉴 목록</h3>

    <!-- 🔍 검색창 -->
    <div class="d-flex mb-4" style="gap: 8px;">
      <v-text-field v-model="search" label="메뉴명 검색" prepend-inner-icon="mdi-magnify" class="flex-grow-1"
        @keyup.enter="handleSearch" />
    </div>

    <!-- 카테고리 탭 -->
    <v-sheet elevation="6" class="mb-4">
      <v-tabs v-model="selectedTab" bg-color="#D8DBBD" show-arrows next-icon="mdi-arrow-right-bold-box-outline"
        prev-icon="mdi-arrow-left-bold-box-outline">
        <v-tab @click="fetchFranchiseMenus">전체</v-tab>
        <v-tab v-for="cat in allCategories" :key="cat.id" @click="fetchMenusByCategory(cat.id)">
          {{ cat.categoryName }}
        </v-tab>
      </v-tabs>
    </v-sheet>

    <!-- 메뉴 카드 목록 -->
    <v-row>
      <v-col v-for="menu in franchiseMenus" :key="menu.menuId" cols="12" sm="6" md="3">
        <v-card class="hoverable" @click="goToDetail(menu.menuId)">
          <v-img :src="menu.image" aspect-ratio="1" cover />
          <v-card-title>
            {{ menu.name }}
            <v-chip class="ml-2" :color="menu.status === 'ACTIVE' ? 'green' : 'grey'" text-color="white" x-small>
              {{ menu.status === 'ACTIVE' ? '활성화' : '비활성화' }}
            </v-chip>
          </v-card-title> <v-card-subtitle>{{ menu.price }}원</v-card-subtitle>
          <v-card-text>
            {{ menu.description }}
            <div v-if="menu.categories?.length" class="category-chip-container mt-2">
              <v-chip v-for="(cat, index) in menu.categories" :key="index" class="ma-1" color="indigo"
                text-color="white" label small>
                {{ cat.categoryName }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- ✅ 페이징 -->
    <v-pagination v-if="!selectedCategoryId" v-model="page" :length="totalPages" @input="fetchFranchiseMenus"
      class="mt-4" />
  </div>
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
</style>