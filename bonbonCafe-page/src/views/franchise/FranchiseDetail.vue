<template>
  <v-container class="">
    <v-col>
      <h2>가맹점 상세 정보{{ franchiseId }}</h2>
    </v-col>
    <v-col>
      <!-- FranchiseForm을 읽기 전용 모드로 -->
      <!-- <FranchiseForm :readonly="true" v-if="formData" :form="formData" /> -->
      <v-row>
        <v-col>
          <FranchiseForm 
          :readonly="true" 
          v-if="formData" 
          :initialFormData="formData" 
          :submitVisible="false" 
          @edit="goToEdit(item)"
          @delete="handleDelete"
          @back="router.back()"
          />
        </v-col>
        <v-col>
          <FranchiseMenuById/>
        </v-col>
  
        
      </v-row>
    </v-col>
  </v-container>
</template>

<script setup>

import apiClient from '@/api'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter  } from 'vue-router'
import FranchiseForm from '@/components/franchise/FranchiseForm.vue'
import FranchiseMenuById from '@/views/menu/FranchiseMenuById.vue'

const route = useRoute()
const router = useRouter()

const franchiseId = route.params.franchiseId 


const formData = ref(null)



const fetchFranchiseDetail = async () => {
  if (!franchiseId || franchiseId === 'undefined') return

  try {
    const response = await apiClient.get(`/franchise/${franchiseId}`)
    
    formData.value = response.data
  } catch (error) {
    console.error('가맹점 정보 조회 실패:', error)
  }
}

onMounted(() => {
  fetchFranchiseDetail()
})


function goToEdit() {
  router.push(`/franchise-edit/${franchiseId}`)
}

function handleDelete() {
  const confirmed = confirm('정말로 삭제하시겠습니까?')
  if (!confirmed) return

  apiClient.delete(`/franchise/${franchiseId}`)
    .then(() => {
      alert('삭제되었습니다.')
      router.push('/franchise-list') // 목록 페이지 등으로 리디렉션
    })
    .catch(error => {
      console.error('삭제 실패', error)
    })
}
</script>

<style scoped>

</style>