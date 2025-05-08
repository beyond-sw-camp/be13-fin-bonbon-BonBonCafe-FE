<template>
    <div>
      <h3>메뉴 등록</h3>
  
      <v-form ref="formRef" @submit.prevent="submitMenu">
        <v-text-field v-model="menu.name" label="메뉴 이름" required />
        <v-text-field v-model="menu.price" label="가격" type="number" required />
        <v-text-field v-model="menu.description" label="설명" />
  
        <v-select
          v-model="menu.status"
          :items="['ACTIVE', 'INACTIVE']"
          label="상태"
          required
        />
  
        <v-text-field v-model="menu.image" label="이미지 URL" />
  
        <!-- ✅ 카테고리 선택 -->
        <v-autocomplete
          v-model="selectedCategories"
          :items="allCategories"
          label="카테고리"
          item-title="categoryName"
          item-value="id"
          multiple
          chips
        />
  
        <v-btn color="primary" type="submit">등록</v-btn>
        <v-btn color="secondary" @click="goBack">취소</v-btn>
      </v-form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import apiClient from '@/api'
  
  const route = useRoute()
  const router = useRouter()
  
//   const headquarterId = route.params.headquarterId
  const headquarterId = 1; //하드코딩
  const formRef = ref(null)
  const menu = ref({
    name: '',
    price: 0,
    description: '',
    status: 'ACTIVE',
    image: '',
  })
  
  const selectedCategories = ref([])
  const allCategories = ref([])
  
  onMounted(async () => {
    try {
      const res = await apiClient.get(`/headquarters/${headquarterId}/categories`)
      allCategories.value = res.data
    } catch (e) {
      console.error('❌ 카테고리 불러오기 실패', e)
    }
  })
  
  const submitMenu = async () => {
    await apiClient.post(`/headquarters/${headquarterId}/menus`, {
      name: menu.value.name,
      price: menu.value.price,
      description: menu.value.description,
      status: menu.value.status,
      image: menu.value.image,
      categoryIds: selectedCategories.value,
    })
  
    alert('메뉴가 등록되었습니다.')
    router.push({ name: 'menu-list', params: { headquarterId } })
  }
  
  const goBack = () => {
    router.back()
  }
  </script>
  
  <style scoped>
  h3 {
    margin-bottom: 16px;
  }
  </style>