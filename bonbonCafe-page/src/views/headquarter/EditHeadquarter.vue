<template>
    <div class="p-6 edit-wrapper">
      <h3 class="text-2xl font-bold mb-6 text-center">🔧 본사 정보 수정</h3>
  
      <v-card class="pa-6 edit-card elevation-2">
        <v-form @submit.prevent="updateInfo">
          <v-text-field
            v-model="form.name"
            label="이름"
            required
            class="mb-4"
          />
          <v-text-field
            v-model="form.headquarterTel"
            label="전화번호"
            required
            class="mb-4"
          />
          <v-text-field
            v-model="form.roadAddress"
            label="도로명 주소"
            required
            class="mb-4"
            readonly
            @click="openPostcode"
          />
          <v-text-field
            v-model="form.detailAddress"
            label="상세 주소"
            class="mb-6"
          />
  
          <div class="d-flex justify-end" style="gap: 12px">
            <v-btn color="primary" type="submit" variant="flat">수정</v-btn>
            <v-btn variant="outlined" @click="router.back()">취소</v-btn>
          </div>
        </v-form>
      </v-card>
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
  
  // 🏷️ 도로명 주소 검색 팝업
  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        form.value.roadAddress = data.roadAddress // 도로명 주소 선택
      }
    }).open()
  }
  
  const updateInfo = async () => {
    try {
      await apiClient.put('/headquarters', form.value)
      alert('본사 정보가 수정되었습니다.')
      router.push('/')
    } catch (e) {
      alert('수정 실패')
      console.error(e)
    }
  }
  </script>
  
  <style scoped>
  .edit-wrapper {
    max-width: 70%;
    margin: 0 auto;
    background-color: #f9f9f9;
    border-radius: 12px;
  }
  .edit-card {
    border-radius: 12px;
    background-color: #ffffff;
  }
  </style>