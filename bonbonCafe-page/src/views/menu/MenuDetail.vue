<template>
  <v-container fluid>
    <v-row class="pa-6" align="stretch" justify="center" style="gap: 24px;">
      <!-- 🧾 메뉴 정보 (왼쪽) -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="pa-6">
          <h3 class="text-2xl font-bold mb-4">{{ menu.name }}</h3>

          <p><strong>가격 :</strong> {{ menu.price }}원</p>
          <p><strong>설명 :</strong> {{ menu.description }}</p>
          <p><strong>상태 :</strong> {{ statusLabel }}</p>

          <!-- 카테고리 -->
          <div v-if="menu.categories?.length" class="mt-4">
            <p><strong>카테고리 :</strong></p>
            <div class="d-flex flex-wrap" style="gap: 6px;">
              <v-chip v-for="cat in menu.categories" :key="cat.id" color="indigo" text-color="white" label small>
                {{ cat.categoryName }}
              </v-chip>
            </div>
          </div>

          <!-- 재료 -->
          <div v-if="menu.menuDetails?.length" class="mt-6">
            <p><strong>재료 :</strong></p>
            <ul class="ingredient-list">
              <li v-for="detail in menu.menuDetails" :key="detail.ingredientName">
                {{ detail.ingredientName }} - {{ detail.quantity }}{{ detail.unit }}

              </li>
            </ul>
          </div>

          <!-- 버튼 -->
          <v-card-actions class="justify-end mt-6">
            <v-btn class="menu-back-btn" @click="goToMenuList">
              <v-icon start>mdi-chevron-left</v-icon> 메뉴 목록
            </v-btn>
            <v-btn v-if="userRole === 'ROLE_HEADQUARTER' || userRole === 'ROLE_MANAGER'" color="secondary"
              @click="dialog = true">
              가맹점 목록 보기
            </v-btn>
            <v-btn v-if="userRole === 'ROLE_HEADQUARTER'" color="primary" @click="goToEdit">
              수정
            </v-btn>
            <v-btn v-if="userRole === 'ROLE_HEADQUARTER'" color="error" @click="deleteMenu">
              삭제
            </v-btn>
            <v-btn v-if="userRole === 'ROLE_FRANCHISEE'" color="primary" @click="addMenu">
              메뉴 추가
            </v-btn>
            <v-btn v-if="userRole === 'ROLE_FRANCHISEE'" color="error" @click="removeMenu">
              메뉴 제거
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- ☕ 메뉴 이미지 (오른쪽) -->
      <v-col cols="12" md="5">
        <div class="image-wrapper">
          <template v-if="menu.image && !imageError">
            <v-img :src="menu.image" class="menu-img" cover @error="imageError = true" />
          </template>
          <template v-else>
            <div class="no-image">[ 이미지 없음 ]</div>
          </template>
        </div>
      </v-col>
    </v-row>

    <!-- 💬 가맹점 목록 다이얼로그 -->
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title class="text-h6">📋 가맹점 목록</v-card-title>
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th>가맹점명</th>
                <th>주소</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in franchises" :key="f.franchiseId">
                <td>{{ f.franchiseName }}</td>
                <td>{{ f.roadAddress }} {{ f.detailAddress }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/api'
import { computed } from 'vue'

const statusLabel = computed(() => {
  if (menu.value.status === 'ACTIVE') return '활성화'
  if (menu.value.status === 'INACTIVE') return '비활성화'
  return menu.value.status || '-'
})
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const menu = ref({})
const imageError = ref(false)
const menuId = route.params.menuId
const userRole = authStore.userInfo.role

const dialog = ref(false)
const franchises = ref([])

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
const removeMenu = async () => {
  if (!confirm('이 메뉴를 가맹점에서 제거하시겠습니까?')) return;

  try {
    await apiClient.delete('/franchise-menus', {
      data: { menuId }, // DELETE에 body 포함 시 data로 감싸야 함
    });
    alert('메뉴가 제거되었습니다.');
    router.push({ name: 'franchise-menu-list' });
  } catch (e) {
    console.error('❌ 제거 실패', e);
    const errorMsg = e.response?.data?.message || '제거에 실패했습니다.';
    alert(errorMsg);
  }
};
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
const goToMenuList = () => {
  router.push({ name: 'menu-list' }) // 또는 경로 문자열: '/headquarters/menus'
}

onMounted(async () => {
  const { data } = await apiClient.get(`/headquarters/menus/${menuId}`)
  menu.value = data
})

// 다이얼로그 열릴 때 가맹점 목록 조회
watch(dialog, async (isOpen) => {
  if (isOpen) {
    try {
      const { data } = await apiClient.get(`/franchise-menus/menu/${menuId}/franchises`)
      franchises.value = data
    } catch (e) {
      console.error('❌ 가맹점 목록 조회 실패', e)
    }
  }
})

const formatDate = (date) => new Date(date).toLocaleDateString()
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

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  max-height: 100%;
  border-radius: 12px;
  background-color: #f5f5f5;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.no-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  font-weight: 500;
  color: #888;
}
</style>