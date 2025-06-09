<template>
  <v-container class="py-4 hei" fluid>
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
                <td class="text-center">{{ totalElements - (page - 1) * pageSize - index }}</td>
                <td class="text-center">{{ item.title }}</td>
                <td class="text-center">{{ item.author }}</td>
                <td class="text-center">{{ formatDate(item.createTime) }}</td>
                <td
                  v-if="userRole === 'ROLE_HEADQUARTER'"
                  class="text-center"
                >
                  <v-chip
                    :color="item.sent ? 'success' : 'error'"
                    text-color="white"
                    size="small"
                    label
                  >
                    {{ item.sent ? '전송 완료' : '미전송' }}
                  </v-chip>
                </td>
              </tr>
            </template>
          </v-data-table>

          <!-- 📄 페이지네이션 -->
          <v-row class="mt-4 justify-end">
  <v-col cols="auto">
    <v-pagination
      v-model="page"
      :length="totalPages"
      :total-visible="10"
      @update:model-value="fetchEvents"
      class="custom-pagination"
      color="#2A3663"
    />
  </v-col>
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
  { title: '번호', key: 'number', align: 'center', sortable: false },
  { title: '제목', key: 'title', align: 'center', sortable: false },
  { title: '작성자', key: 'author', align: 'center', sortable: false },
  { title: '작성일', key: 'createTime', align: 'center', sortable: false },
  ...(userRole.value === 'ROLE_HEADQUARTER'
    ? [{ title: '문자 전송', key: 'sent', align: 'center', sortable: false }]
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
.hei {
  min-height: 900px;
}
.list {
  font-size: 16px;
  font-weight: 600;
  color: gray;
}
.custom-pagination >>> .v-pagination__item.v-pagination__item--is-active {
  background-color: #caddf0 !important;
  color: white !important;
  font-weight: bold;
  border-radius: 8px;
}
:deep(.rounded-table thead) {
  background-color: #f2f5f8;
}

:deep(.rounded-table tbody tr:hover) {
  background-color: #f4faff;
  cursor: pointer;
}
</style>