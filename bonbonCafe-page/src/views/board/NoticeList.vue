<template>
  <div class="notice-wrapper ma-10 pa-8">
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-2xl font-semibold">📌 공지사항 목록</h2>
      <v-btn v-if="userRole === 'ROLE_HEADQUARTER'" color="primary" @click="goToRegister" prepend-icon="mdi-plus">
        공지 등록
      </v-btn>
    </div>

    <v-card class="notice-card elevation-1">
      <v-table class="rounded-header-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th v-if="userRole === 'ROLE_HEADQUARTER'" class="text-center">문자전송</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(notice, index) in notices" :key="notice.noticeId" @click="goToDetail(notice.noticeId)"
            style="cursor: pointer">
            <td>{{ totalElements - (page - 1) * pageSize - index }}</td>
            <td>{{ notice.title }}</td>
            <td>{{ notice.author }}</td>
            <td>{{ formatDate(notice.createTime) }}</td>
            <td v-if="userRole === 'ROLE_HEADQUARTER'" class="text-center">
              {{ notice.sent ? '✅' : '❌' }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-pagination v-model="page" :length="totalPages" @input="fetchNotices" class="mt-4" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/api'

const router = useRouter()
const authStore = useAuthStore()
const userRole = computed(() => authStore.userInfo.role)

const notices = ref([])
const page = ref(1)
const pageSize = 10
const totalPages = ref(1)
const totalElements = ref(0)

const fetchNotices = async () => {
  try {
    const { data } = await apiClient.get(`/notice`, {
      params: {
        page: page.value - 1,
        postType: 'NOTICE'
      }
    })
    notices.value = data.content
    totalPages.value = data.totalPages
    totalElements.value = data.totalElements
  } catch (e) {
    console.error('❌ 공지사항 목록 조회 실패', e)
  }
}

const goToDetail = (noticeId) => {
  router.push(`/headquarters/notices/${noticeId}`)
}

const goToRegister = () => {
  router.push('/notice-register')
}

const formatDate = (datetime) => {
  return new Date(datetime).toLocaleDateString()
}

onMounted(fetchNotices)
watch(page, fetchNotices)
</script>

<style scoped>
.notice-wrapper {
  background-color: #f9f9f9;
  border-radius: 12px;
}

.notice-card {
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.rounded-header-table thead {
  background-color: #D8DBBD;
}

.rounded-header-table thead th {
  font-weight: bold;
}

.rounded-header-table tbody tr:hover {
  background-color: #f0f8ff;
  transition: background-color 0.2s;
}
</style>