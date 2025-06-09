<template>
  <v-container class="containerF" fluid>
    <!-- 타이틀 영역 -->
    <v-row justify="center" class="pa-10 pb-0">
      <v-col>
        <v-row class="mb-6">
          <v-icon color="primary" size="40">mdi-store-plus</v-icon>
          <div class="text-h5 font-weight-bold mt-2">가맹점 관리 / 가맹점 등록</div>
        </v-row>
        <v-divider class="my-4"></v-divider>
      </v-col>
      
    </v-row>

    <!-- 폼 카드 -->
      <v-col>
          <FranchiseForm
            :initialFormData="{}"
            :readonly="false"
            :submitVisible="true"
            mode="create"
            @submit="onSubmitFranchise"
            class="addForm"
          />
      </v-col>

    <!-- 다이얼로그 -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">등록 확인</v-card-title>
        <v-card-text>정말 등록하시겠습니까?</v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey-darken-1" text @click="dialog = false">취소</v-btn>
          <v-btn color="primary" @click="confirmSubmit">확인</v-btn>
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
    router.push('/franchise-list')
  } catch (error) {
    dialog.value = false
    if (error.response && error.response.status === 409) {
      alert('이미 동일한 위치에 가맹점이 등록되어 있습니다.')
    } else {
      alert('등록 중 오류가 발생했습니다.')
      console.error(error)
    }
  }
}
</script>

<style scoped>
.containerF {
  max-width: 1400px;
  margin: 0 auto;
}
</style>
