<template>
  <div class="p-6 headquarter-wrapper">
    <h3 class="text-2xl font-bold mb-6 text-center">🏢 내 본사 정보</h3>

    <v-card class="pa-6 info-card elevation-2">
      <v-row dense>
        <v-col cols="12">
          <p><strong>👤 이름:</strong> {{ info.name }}</p>
        </v-col>
        <v-col cols="12">
          <p><strong>📞 전화번호:</strong> {{ info.headquarterTel }}</p>
        </v-col>
        <v-col cols="12">
          <p><strong>📍 주소:</strong> {{ info.roadAddress }} {{ info.detailAddress }}</p>
        </v-col>
        <v-col cols="12">
          <p><strong>🕓 생성일:</strong> {{ formatDate(info.createTime) }}</p>
        </v-col>
        <v-col cols="12">
          <p><strong>🛠 수정일:</strong> {{ formatDate(info.modifyAt) }}</p>
        </v-col>
      </v-row>

      <div class="d-flex justify-end mt-4" v-if="userRole === 'ROLE_HEADQUARTER'">
        <v-btn color="primary" @click="goToEdit">수정</v-btn>
      </div>
    </v-card>
  </div>
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
</style>