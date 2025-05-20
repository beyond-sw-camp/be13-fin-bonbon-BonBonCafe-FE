<template>
    <div class="p-6">
      <h3 class="text-xl font-semibold mb-4">🔧 본사 정보 수정</h3>
      <v-form @submit.prevent="updateInfo">
        <v-text-field v-model="form.name" label="이름" required />
        <v-text-field v-model="form.headquarterTel" label="전화번호" required />
        <v-text-field v-model="form.roadAddress" label="도로명 주소" required />
        <v-text-field v-model="form.detailAddress" label="상세 주소" />
        <v-btn color="primary" type="submit">수정</v-btn>
      </v-form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import apiClient from '@/api'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const form = ref({
    name: '',
    headquarterTel: '',
    roadAddress: '',
    detailAddress: ''
  })
  
  onMounted(async () => {
    const { data } = await apiClient.get('/headquarters')
    Object.assign(form.value, data)
  })
  
  const updateInfo = async () => {
    try {
      await apiClient.put('/headquarters', form.value)
      alert('본사 정보가 수정되었습니다.')
      router.push('/') // 수정 후 이동할 페이지
    } catch (e) {
      alert('수정 실패')
      console.error(e)
    }
  }
  </script>