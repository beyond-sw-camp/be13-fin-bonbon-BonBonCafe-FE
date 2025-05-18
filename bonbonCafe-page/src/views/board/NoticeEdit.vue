<template>
    <div>
      <h2>게시글 수정</h2>
  
      <v-form @submit.prevent="submitUpdate" ref="formRef">
        <v-text-field v-model="form.title" label="제목" required />
        <v-textarea v-model="form.content" label="내용" required />
        <v-select
          v-model="form.postType"
          label="유형"
          :items="['NOTICE', 'EVENT']"
          required
        />
  
        <div class="mt-4 d-flex justify-end" style="gap: 8px;">
          <v-btn color="primary" type="submit">
            수정 완료
          </v-btn>
          <v-btn color="secondary" @click="goBack">취소</v-btn>
        </div>
      </v-form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import apiClient from '@/api'
  
  const route = useRoute()
  const router = useRouter()
  
  const headquarterId = route.params.headquarterId
  const noticeId = route.params.noticeId
  
  const form = ref({
    title: '',
    content: '',
    postType: 'NOTICE', // 기본값을 NOTICE로 설정
    author: ''
  })
  
  const formRef = ref(null)
  
  const fetchNotice = async () => {
    try {
      const { data } = await apiClient.get(`/notice/${noticeId}/${headquarterId}`)
      form.value = {
        title: data.title,
        content: data.content,
        postType: data.postType,
        author: data.author
      }
    } catch (e) {
      console.error('❌ 공지/이벤트 로딩 실패', e)
    }
  }
  
  const submitUpdate = async () => {
    try {
      await apiClient.put(`/notice/${noticeId}/${headquarterId}`, form.value)
      alert(`${form.value.postType === 'EVENT' ? '이벤트' : '공지사항'} 수정 완료!`)
      const target = form.value.postType === 'EVENT' ? 'events' : 'notices'
      router.push(`/headquarters/${headquarterId}/${target}/${noticeId}`)
    } catch (e) {
      console.error('❌ 수정 실패', e)
      alert('수정 중 오류 발생')
    }
  }
  
  const goBack = () => {
    router.back()
  }
  
  onMounted(fetchNotice)
  </script>
  
  <style scoped>
  h2 {
    margin-bottom: 16px;
  }
  </style>