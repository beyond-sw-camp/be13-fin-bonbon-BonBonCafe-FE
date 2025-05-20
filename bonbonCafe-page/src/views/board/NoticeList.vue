<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-4">
      <h2>📌 공지사항 목록</h2>
      <v-btn color="primary" @click="goToRegister" prepend-icon="mdi-plus">
        공지 등록
      </v-btn>
    </div>

    <v-table>
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일</th>
          <th class="text-center">문자전송</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(notice, index) in notices"
          :key="notice.noticeId"
          @click="goToDetail(notice.noticeId)"
          style="cursor: pointer"
        >
          <td>{{ totalElements - (page - 1) * pageSize - index }}</td>
          <td>{{ notice.title }}</td>
          <td>{{ notice.author }}</td>
          <td>{{ formatDate(notice.createTime) }}</td>
          <td class="text-center">{{ notice.sent ? '✅' : '❌' }}</td>
        </tr>
      </tbody>
    </v-table>

    <v-pagination
      v-model="page"
      :length="totalPages"
      @input="fetchNotices"
      class="mt-4"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api'

const router = useRouter()

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
  router.push('/notice-register') // 등록 페이지 경로 맞춰주세요
}

const formatDate = (datetime) => {
  return new Date(datetime).toLocaleDateString()
}

onMounted(fetchNotices)
watch(page, fetchNotices)
</script>

<style scoped>
h2 {
  margin-bottom: 0;
}
</style>