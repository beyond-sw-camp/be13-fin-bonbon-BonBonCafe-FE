<template>
  <v-container class="containerF">
      <v-col>
        <h2>가맹점 등록</h2>
      </v-col>
      <v-col>
        <FranchiseForm 
          ref="franchiseFormRef" 
          mode="create"
          @submit="onSubmitFranchise" />
      </v-col>


      <!-- 확인용 다이얼로그 -->
      <v-dialog v-model="dialog" max-width="400">
        <v-card>
          <v-card-title class="text-h6">등록 확인</v-card-title>
          <v-card-text>정말 등록하시겠습니까?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="confirmSubmit">확인</v-btn>
            <v-btn color="grey" @click="dialog = false">취소</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
import { useRouter } from 'vue-router'
import apiClient from '@/api' // axios 인스턴스


const router = useRouter()
const franchiseFormRef = ref(null)

const dialog = ref(false)
const pendingFormData = ref({})


// FranchiseForm에서 emit된 submit 이벤트 → 다이얼로그로 이어짐
const onSubmitFranchise = (formData) => {
  console.log(formData);
  
  pendingFormData.value = formData
  dialog.value = true // 확인 다이얼로그 열기
}

// 다이얼로그 '확인' 클릭 → 서버로 POST 요청
const confirmSubmit = async () => {
  try {
    const response = await apiClient.post('/franchise', pendingFormData.value)
    console.log('등록 성공:', response.data)
    dialog.value = false

    // 등록 성공 후 페이지 이동
    router.push('/franchise-list')
  } catch (error) {
    console.error('등록 실패:', error)
    dialog.value = false
  }
}

// const onSubmitFranchise = async (formData) => {
//   try {
//     console.log(formData);

//     const confirmed = window.confirm('가맹점을 등록하시겠습니까?');
//     if (!confirmed) {
//       return; // 사용자가 취소를 누르면 아무 동작도 하지 않음
//     }

    
//     const response = await apiClient.post('/franchise', formData)
//     console.log('등록 성공:', response.data)
//     // 성공 후 처리 (예: 페이지 이동)
    
//     router.push('/franchise-list')

//   } catch (error) {
//     console.error('등록 실패:', error)
//   }
// }




</script>

<style scoped>

.btnBox{
  display: flex;
}
</style>

