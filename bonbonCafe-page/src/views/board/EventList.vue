<template>
  <div class="event-wrapper ma-10 pa-8">
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-2xl font-semibold">🎉 이벤트 게시판</h2>
      <v-btn color="primary" @click="goToRegister" prepend-icon="mdi-plus">
        이벤트 등록
      </v-btn>
    </div>

    <v-card class="event-card elevation-1">
      <v-table class="rounded-header-table">
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
            v-for="(event, index) in events"
            :key="event.noticeId"
            @click="goToDetail(event.noticeId)"
            style="cursor: pointer"
          >
            <td>{{ totalElements - (page - 1) * pageSize - index }}</td>
            <td>{{ event.title }}</td>
            <td>{{ event.author }}</td>
            <td>{{ formatDate(event.createTime) }}</td>
            <td class="text-center">{{ event.sent ? '✅' : '❌' }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-pagination
      v-model="page"
      :length="totalPages"
      @input="fetchEvents"
      class="mt-4"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api'

const router = useRouter()

const events = ref([])
const page = ref(1)
const pageSize = 10
const totalPages = ref(1)
const totalElements = ref(0)

const fetchEvents = async () => {
  try {
    const { data } = await apiClient.get(`/notice`, {
      params: {
        page: page.value - 1,
        postType: 'EVENT'
      }
    })
    events.value = data.content
    totalPages.value = data.totalPages
    totalElements.value = data.totalElements
  } catch (e) {
    console.error('❌ 이벤트 목록 조회 실패', e)
  }
}

const goToDetail = (id) => {
  router.push(`/headquarters/events/${id}`)
}

const goToRegister = () => {
  router.push('/event-register')
}

const formatDate = (datetime) => {
  return new Date(datetime).toLocaleDateString()
}

onMounted(fetchEvents)
watch(page, fetchEvents)
</script>

<style scoped>
.event-wrapper {
  background-color: #f9f9f9;
  border-radius: 12px;
}

.event-card {
  border-radius: 12px 12px 0 0; /* 상단만 둥글게 */
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