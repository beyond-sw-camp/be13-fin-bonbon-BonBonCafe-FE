<template>
  <v-container class="py-4" fluid>
    <v-row dense>
      <v-col cols="12" md="6" offset-md="3">
        <v-card class="pa-6 elevation-2" style="height: 650px;">
          <v-typography class="list" align="center">
            본사 /
          </v-typography>
          <v-typography class="title" align="center">
            내 본사 정보
          </v-typography>

          <br /><br />

          <v-row dense>
            <v-col cols="12" class="mb-3">
              <div class="info-label">이름</div>
              <div class="info-value">{{ info.name }}</div>
            </v-col>

            <v-col cols="12" class="mb-3">
              <div class="info-label">전화번호</div>
              <div class="info-value">{{ info.headquarterTel }}</div>
            </v-col>

            <v-col cols="12" class="mb-3">
              <div class="info-label">주소</div>
              <div class="info-value">{{ info.roadAddress }} {{ info.detailAddress }}</div>
            </v-col>

            <v-col cols="12" class="mb-3">
              <div class="info-label">생성일</div>
              <div class="info-value">{{ formatDate(info.createTime) }}</div>
            </v-col>

            <v-col cols="12" class="mb-3">
              <div class="info-label">수정일</div>
              <div class="info-value">{{ formatDate(info.modifyAt) }}</div>
            </v-col>

            <v-divider class="mt-3 mb-4"></v-divider>

            <v-col cols="12" class="d-flex justify-end" v-if="userRole === 'ROLE_HEADQUARTER'">
              <v-btn color="primary" @click="goToEdit">수정</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const info = ref({})
const authStore = useAuthStore()
const userRole = computed(() => authStore.userInfo.role) // ✅ 사용자 권한

const formatDate = (datetime) => {
  return datetime ? new Date(datetime).toLocaleString() : '-'
}

const goToEdit = () => {
  router.push({ name: 'headquarter-edit' })
}

onMounted(async () => {
  const { data } = await apiClient.get('/headquarters')
  info.value = data
})
</script>

<style scoped>
.headquarter-wrapper {
  background-color: #f9f9f9;
  border-radius: 12px;
  max-width: 70%;
  margin: 0 auto;
}

.info-card {
  border-radius: 12px;
  background-color: white;
}
.info-label {
  font-size: 14px;
  color: #888;
  margin-bottom: 4px;
}

.info-value {
  font-size: 16px;
  font-weight: 500;
  color: #222;
}

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
</style>