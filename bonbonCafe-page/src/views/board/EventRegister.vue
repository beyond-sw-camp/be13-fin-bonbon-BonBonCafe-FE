<template>
  <div class="event-register-wrapper pa-10">
    <h2 class="text-2xl font-bold mb-6 text-center">🎉 이벤트 등록</h2>

    <v-card class="pa-6 elevation-2 event-card">
      <v-form @submit.prevent="submitNotice" ref="formRef">
        <v-text-field
          v-model="form.title"
          label="제목"
          required
          class="mb-4"
        />
        <v-textarea
          v-model="form.content"
          label="내용"
          rows="6"
          required
          class="mb-6"
        />

        <div class="d-flex justify-end" style="gap: 12px;">
          <v-btn color="#D8DBBD" variant="flat" type="submit">등록</v-btn>
          <v-btn variant="outlined" @click="goBack">취소</v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api'

const router = useRouter()
const formRef = ref(null)

const form = ref({
  title: '',
  content: '',
  postType: 'EVENT',
  author: ''
})

const submitNotice = async () => {
  try {
    const { data } = await apiClient.post(`/notice`, form.value)
    alert('이벤트 등록 완료!')
    router.push(`/headquarters/events/${data.noticeId}`)
  } catch (e) {
    console.error('❌ 등록 실패', e)
    alert('이벤트 등록 중 오류 발생')
  }
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.event-register-wrapper {
  max-width: 700px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 12px;
}

.event-card {
  border-radius: 12px;
  background-color: #ffffff;
}
</style>