<template>
  <v-container fluid>
    <v-row class="pa-6" align="stretch" justify="center" style="gap: 24px;">
      <!-- 🧾 메뉴 정보 (왼쪽) -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="pa-6">
          <h3 class="text-2xl font-bold mb-4">{{ menu.name }}</h3>

          <p><strong>가격:</strong> {{ menu.price }}원</p>
          <p><strong>설명:</strong> {{ menu.description }}</p>
          <p><strong>상태:</strong> {{ menu.status }}</p>

          <!-- 카테고리 -->
          <div v-if="menu.categories?.length" class="mt-4">
            <p><strong>카테고리:</strong></p>
            <div class="d-flex flex-wrap" style="gap: 6px;">
              <v-chip
                v-for="cat in menu.categories"
                :key="cat.id"
                color="indigo"
                text-color="white"
                label
                small
              >
                {{ cat.categoryName }}
              </v-chip>
            </div>
          </div>

          <!-- 재료 -->
          <div v-if="menu.menuDetails?.length" class="mt-6">
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

          <!-- 버튼 -->
          <v-card-actions class="justify-end mt-6">
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
            <v-btn
              v-if="userRole === 'ROLE_FRANCHISEE'"
              color="primary"
              @click="addMenu"
            >
              가맹점에 추가
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- ☕ 메뉴 이미지 (오른쪽) -->
      <v-col cols="12" md="5">
        <v-img
          :src="menu.image"
          height="320"
          class="rounded-lg"
          cover
        />
      </v-col>
    </v-row>
  </v-container>
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
const userRole = authStore.userInfo.role

const goToEdit = () => {
  router.push(`/headquarters/menus/${menuId}/edit`)
}

const deleteMenu = async () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    await apiClient.delete(`/headquarters/menus/${menuId}`)
    alert('삭제되었습니다.')
    router.push({ name: 'menu-list' })
  }
}

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

onMounted(async () => {
  const { data } = await apiClient.get(`/headquarters/menus/${menuId}`)
  menu.value = data
})
</script>

<style scoped>
.ingredient-list {
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