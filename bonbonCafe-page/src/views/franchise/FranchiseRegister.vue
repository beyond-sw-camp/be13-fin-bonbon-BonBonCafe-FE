<template>
  <v-container class="containerF">
    <v-col>
      <h2>가맹점 등록</h2>
    </v-col>
    <v-col>
      <FranchiseForm 
        :readonly="false"
        :submitVisible="true"
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
  </v-container>    
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api'
import FranchiseForm from '@/components/franchise/FranchiseForm.vue'

const router = useRouter()
const dialog = ref(false)
const pendingFormData = ref({})

const onSubmitFranchise = (formData) => {
  pendingFormData.value = formData
  dialog.value = true
}

const confirmSubmit = async () => {
  try {
    const response = await apiClient.post('/franchise', pendingFormData.value)
    dialog.value = false
    alert('등록이 완료되었습니다.')
    router.push(`/franchise-detail/${response.data.id}`) // 등록 후 상세 페이지 이동
  } catch (error) {
    console.error('등록 실패:', error)
    alert('등록 중 오류가 발생했습니다.')
  }
}
</script>
