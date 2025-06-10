<template>
  <div class="edit-wrapper pa-10">
    <h2 class="text-2xl font-bold mb-6 text-center">📄 게시글 수정</h2>

    <v-card class="pa-6 elevation-2 edit-card">
      <v-form @submit.prevent="submitUpdate" ref="formRef">
        <v-text-field v-model="form.title" label="제목" required class="mb-4" />
        <v-textarea v-model="form.content" label="내용" rows="6" required class="mb-4" />
        <v-select v-model="form.postType" label="유형" :items="[
          { text: '공지', value: 'NOTICE' },
          { text: '이벤트', value: 'EVENT' }
        ]" item-title="text" item-value="value" required class="mb-6" />

        <div class="d-flex justify-end" style="gap: 12px;">
          <v-btn color="#D8DBBD" variant="flat" type="submit">수정 완료</v-btn>
          <v-btn variant="outlined" @click="goBack">취소</v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '@/api'

const route = useRoute()
const router = useRouter()

const noticeId = route.params.noticeId

const form = ref({
  title: '',
  content: '',
  postType: 'NOTICE',
  author: ''
})

const formRef = ref(null)

const fetchNotice = async () => {
  try {
    const { data } = await apiClient.get(`/notice/${noticeId}`)
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
    await apiClient.put(`/notice/${noticeId}`, form.value)
    alert(`${form.value.postType === 'EVENT' ? '이벤트' : '공지사항'} 수정 완료!`)
    const target = form.value.postType === 'EVENT' ? 'events' : 'notices'
    router.push(`/headquarters/${target}/${noticeId}`)
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
.edit-wrapper {
  max-width: 700px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 12px;
}

.edit-card {
  border-radius: 12px;
  background-color: #ffffff;
}
</style>