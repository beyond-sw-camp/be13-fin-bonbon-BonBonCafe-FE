<template>
  <v-container class="containerF">
      <v-col>
        <h2>가맹점 등록</h2>
      </v-col>
      <v-col>
        <FranchiseForm ref="franchiseFormRef" @submit="onSubmitFranchise" />
      </v-col>
      <!-- <v-col class="btnBox">
        <v-btn  
          rounded="xl" 
          color="#D8DBBD"
          size="small" 
          width="100px"
          class="mt-8"
        >
          등록
        </v-btn>
        <v-btn  
          rounded="xl" 
          color="#efefef"
          size="small" 
          width="100px"
          class="mt-8"
        >
          뒤로가기
        </v-btn>
      </v-col> -->
  </v-container>    
    


</template>

<script setup>
import FranchiseForm from '@/components/franchise/FranchiseForm.vue';

import { ref } from 'vue'
import apiClient from '@/api' // axios 인스턴스

const franchiseFormRef = ref(null)

const onSubmitFranchise = async (formData) => {
  try {
    console.log(formData);
    
    const response = await apiClient.post('/franchise', formData)
    console.log('등록 성공:', response.data)
    // 성공 후 처리 (예: 페이지 이동)
  } catch (error) {
    console.error('등록 실패:', error)
  }
}

const submitForm = () => {
  franchiseFormRef.value?.handleSubmit()
}



</script>

<style scoped>

.btnBox{
  display: flex;
}
</style>

