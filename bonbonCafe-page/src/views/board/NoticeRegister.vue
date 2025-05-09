<template>
    <div>
      <h2>📢 공지 등록</h2>
  
      <v-form @submit.prevent="submitNotice" ref="formRef">
        <v-text-field v-model="form.title" label="제목" required />
        <v-textarea v-model="form.content" label="내용" rows="5" required />
  
        <div class="mt-4 d-flex justify-end" style="gap: 8px;">
          <v-btn color="primary" type="submit">등록</v-btn>
          <v-btn color="secondary" @click="goBack">취소</v-btn>
        </div>
      </v-form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import apiClient from '@/api'
  
  const router = useRouter()
  const headquarterId = 3 // 필요 시 props로 대체 가능
  
  const formRef = ref(null)
  
  const form = ref({
    title: '',
    content: '',
    postType: 'NOTICE', // 고정
    author: ''
  })
  
  const submitNotice = async () => {
    try {
      const { data } = await apiClient.post(`/notice/${headquarterId}`, form.value)
      alert('공지 등록 완료!')
      router.push(`/headquarters/${headquarterId}/notices/${data.noticeId}`)
    } catch (e) {
      console.error('❌ 등록 실패', e)
      alert('공지 등록 중 오류 발생')
    }
  }
  
  const goBack = () => {
    router.back()
  }
  </script>
  
  <style scoped>
  h2 {
    margin-bottom: 16px;
  }
  </style>