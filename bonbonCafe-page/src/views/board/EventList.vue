<template>
  <v-container class="py-4" fluid>
    <v-row dense>
      <v-col cols="12" md="10" offset-md="1">
        <v-card class="pa-6 elevation-2" style="min-height: 650px;">
          <v-row class="mb-4" align="center" justify="space-between">
            <v-col>
              <v-typography class="list">게시판 /</v-typography>
              <v-typography class="title">🎉 이벤트 게시판</v-typography>
            </v-col>
            <v-col class="text-right" v-if="userRole === 'ROLE_HEADQUARTER'">
              <v-btn color="primary" @click="goToRegister">
                <v-icon start>mdi-plus</v-icon>
                이벤트 등록
              </v-btn>
            </v-col>
          </v-row>

          <!-- 📋 테이블 -->
          <v-data-table
            :headers="headers"
            :items="events"
            class="rounded-table"
            density="comfortable"
            hide-default-footer
          >
            <template #item="{ item, index }">
              <tr @click="goToDetail(item.noticeId)" style="cursor: pointer;">
                <td>{{ totalElements - (page - 1) * pageSize - index }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.author }}</td>
                <td>{{ formatDate(item.createTime) }}</td>
                <td v-if="userRole === 'ROLE_HEADQUARTER'" class="text-center">
                  {{ item.sent ? '✅' : '❌' }}
                </td>
              </tr>
            </template>
          </v-data-table>

          <!-- 📄 페이지네이션 -->
          <v-row class="mt-4 justify-end">
            <v-pagination
              v-model="page"
              :length="totalPages"
              @input="fetchEvents"
              color="primary"
            />
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/api'

const router = useRouter()
const authStore = useAuthStore()
const userRole = computed(() => authStore.userInfo.role)

const events = ref([])
const page = ref(1)
const pageSize = 10
const totalPages = ref(1)
const totalElements = ref(0)

const headers = [
  { title: '번호', key: 'number' },
  { title: '제목', key: 'title' },
  { title: '작성자', key: 'author' },
  { title: '작성일', key: 'createTime' },
  ...(userRole.value === 'ROLE_HEADQUARTER'
    ? [{ title: '문자전송', key: 'sent', align: 'center' }]
    : [])
]

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
.title {
  font-size: 20px;
  font-weight: 600;
  color: #3f51b5;
}

.list {
  font-size: 16px;
  font-weight: 600;
  color: gray;
}

:deep(.rounded-table thead) {
  background-color: #f2f5f8;
}

:deep(.rounded-table tbody tr:hover) {
  background-color: #f4faff;
  cursor: pointer;
}
</style>