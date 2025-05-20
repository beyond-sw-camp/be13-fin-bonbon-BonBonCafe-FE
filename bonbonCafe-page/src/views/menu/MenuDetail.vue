<template>
    <div>
      <h3>{{ menu.name }}</h3>
  
      <v-img :src="menu.image" height="200" class="mb-4" cover />
  
      <v-card>
        <v-card-text>
          <p><strong>가격:</strong> {{ menu.price }}원</p>
          <p><strong>설명:</strong> {{ menu.description }}</p>
          <p><strong>상태:</strong> {{ menu.status }}</p>
  
          <div v-if="menu.categories?.length">
            <p><strong>카테고리:</strong></p>
            <div class="category-chip-container">
              <v-chip
                v-for="cat in menu.categories"
                :key="cat.id"
                class="ma-1"
                color="indigo"
                text-color="white"
                label
                small
              >
                {{ cat.categoryName }}
              </v-chip>
            </div>
          </div>
  
          <div v-if="menu.menuDetails?.length">
            <p><strong>재료:</strong></p>
            <ul class="ingredient-list">
              <li
                v-for="detail in menu.menuDetails"
                :key="detail.ingredientName"
              >
                {{ detail.ingredientName }} - {{ detail.quantity }}g
              </li>
            </ul>
          </div>
        </v-card-text>
  
        <v-card-actions class="justify-end">
          <!-- ✅ HEADQUARTER 전용 -->
          <v-btn
            v-if="userRole === 'ROLE_HEADQUARTER'"
            color="primary"
            @click="goToEdit"
          >
            수정
          </v-btn>
          <v-btn
            v-if="userRole === 'ROLE_HEADQUARTER'"
            color="error"
            @click="deleteMenu"
          >
            삭제
          </v-btn>
  
          <!-- ✅ FRANCHISEE 전용 -->
          <v-btn
            v-if="userRole === 'ROLE_FRANCHISEE'"
            color="primary"
            @click="addMenu"
          >
            가맹점에 추가
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import apiClient from '@/api'
  
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  
  const menu = ref({})
  const menuId = route.params.menuId
  const userRole = authStore.userInfo.role  // 'HEADQUARTER' 또는 'FRANCHISEE'
  
  // 수정 페이지 이동
  const goToEdit = () => {
    router.push(`/headquarters/menus/${menuId}/edit`)
  }
  
  // 메뉴 삭제
  const deleteMenu = async () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await apiClient.delete(`/headquarters/menus/${menuId}`)
      alert('삭제되었습니다.')
      router.push({ name: 'menu-list' })
    }
  }
  
  // 가맹점에 메뉴 추가
  const addMenu = async () => {
    try {
      await apiClient.post('/franchise-menus', { menuId })
      alert('가맹점에 메뉴가 추가되었습니다.')
    } catch (e) {
      console.error('❌ 추가 실패', e)
      const errorMsg = e.response?.data?.message || '추가에 실패했습니다.'
      alert(errorMsg)
    }
  }
  
  // 메뉴 정보 조회
  onMounted(async () => {
    const { data } = await apiClient.get(`/headquarters/menus/${menuId}`)
    menu.value = data
    
  })
  </script>
  
  <style scoped>
  h3 {
    margin-bottom: 16px;
  }
  
  .category-chip-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  
  ul.ingredient-list {
    padding-left: 1.2rem;
    margin-top: 8px;
    border-left: 3px solid #ccc;
  }
  
  .ingredient-list li {
    margin-bottom: 6px;
    padding-left: 4px;
    list-style: '🌿 ';
  }
  </style>