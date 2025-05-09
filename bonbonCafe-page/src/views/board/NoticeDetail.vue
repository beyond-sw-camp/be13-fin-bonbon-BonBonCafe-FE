<template>
    <div>
      <h2>{{ notice.title }}</h2>
  
      <div class="mb-2 text-grey">
        <span>작성자: {{ notice.author }}</span> |
        <span>작성일: {{ formatDate(notice.createTime) }}</span>
      </div>
  
      <v-card class="pa-4">
        <div v-html="notice.content" />
      </v-card>
  
      <!-- 전송 여부 안내 -->
      <div class="mt-2" v-if="notice.sent">
        <v-chip color="success" class="ma-1" text-color="white">✅ 문자 전송 완료</v-chip>
      </div>
  
      <!-- 버튼 영역 -->
      <div class="mt-4 d-flex justify-end" style="gap: 8px">
        <v-btn :color="notice.sent ? 'grey' : 'secondary'" @click="sendSms">
          문자 일괄 전송
        </v-btn>
        <v-btn color="warning" @click="goToEdit">수정</v-btn>
        <v-btn color="error" @click="deleteNotice">삭제</v-btn>
        <v-btn color="primary" @click="goBack">목록으로</v-btn>
      </div>
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
  
  const notice = ref({})
  
  const fetchNotice = async () => {
    try {
      const { data } = await apiClient.get(`/notice/${noticeId}/${headquarterId}`)
      notice.value = data
    } catch (e) {
      console.error('❌ 상세 조회 실패', e)
    }
  }
  
  const sendSms = async () => {
    if (notice.value.sent) {
      const confirmed = confirm('이미 문자 보낸 적이 있습니다.\n다시 보내시겠습니까?')
      if (!confirmed) return
    }
  
    try {
      await apiClient.post(`/notice/${noticeId}/send-sms`)
      alert('문자 일괄 전송 완료!')
      fetchNotice()
    } catch (e) {
      console.error('❌ 문자 전송 실패', e)
      alert('문자 전송 중 오류가 발생했습니다.')
    }
  }
  
  const goToEdit = () => {
    router.push(`/headquarters/${headquarterId}/notices/${noticeId}/edit`)
  }
  
  const deleteNotice = async () => {
    const confirmed = confirm('정말 이 공지사항을 삭제하시겠습니까?')
    if (!confirmed) return
  
    try {
      await apiClient.delete(`/notice/${noticeId}/${headquarterId}`)
      alert('삭제되었습니다.')
      router.push('/notice-list') // 그냥 문자열로 이동
    } catch (e) {
      console.error('❌ 삭제 실패', e)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }
  
  const goBack = () => {
    router.push('/notice-list')
}
  
  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString()
  }
  
  onMounted(fetchNotice)
  </script>
  
  <style scoped>
  h2 {
    margin-bottom: 12px;
  }
  </style>