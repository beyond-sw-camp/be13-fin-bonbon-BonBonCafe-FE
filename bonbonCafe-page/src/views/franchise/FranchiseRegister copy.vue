<template>
  <!-- <div>
    <Form/>
  </div> -->

  <v-container class="pa-6" fluid>
    <h2 class="text-h5 font-weight-bold mb-6">가맹점 등록</h2>
    <v-form ref="form" @submit.prevent="submitForm">
      <v-row dense>
        <!-- 좌측 컬럼 -->
        <v-col cols="12" md="6">
          <v-text-field v-model="formData.franchiseName" label="* 가맹점 이름" required />
          <v-file-input
            v-model="formData.storeImage"
            label="매장 사진"
            prepend-icon="mdi-camera"
            accept="image/*"
            show-size
          />
          <v-text-field v-model="formData.phone" label="* 매장 전화번호" required />
          <v-text-field v-model="formData.zipcode" label="우편번호" append-inner-icon="mdi-magnify" />
          <v-text-field v-model="formData.address" label="상세 주소" />
          <v-select
            v-model="formData.businessType"
            label="사업자유형"
            :items="['개인', '법인']"
          />
          <v-row>
            <v-col cols="6">
              <v-text-field v-model="formData.openYear" label="개업 연도" type="number" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="formData.openMonth" label="개업 월" type="number" />
            </v-col>
          </v-row>
        </v-col>

        <!-- 우측 컬럼 -->
        <v-col cols="12" md="6">
          <v-text-field v-model="formData.ownerName" label="* 점주 이름" required />
          <v-file-input
            v-model="formData.ownerImage"
            label="점주 사진"
            prepend-icon="mdi-camera"
            accept="image/*"
            show-size
          />
          <v-select
            v-model="formData.manager"
            label="담당자"
            :items="['김매니저', '이매니저']"
          />
          <v-radio-group v-model="formData.parking" label="주차 가능 여부">
            <v-radio label="가능" value="가능" />
            <v-radio label="불가" value="불가" />
          </v-radio-group>
          <v-row>
            <v-col cols="6">
              <v-text-field v-model="formData.openTime" label="운영 시작 시간" type="time" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="formData.closeTime" label="운영 종료 시간" type="time" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- 버튼 -->
      <v-row class="justify-center mt-6">
        <v-btn color="primary" type="submit" class="mx-2">등록</v-btn>
        <v-btn color="grey lighten-1" @click="resetForm" class="mx-2">등록 취소</v-btn>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  franchiseName: '',
  storeImage: null,
  phone: '',
  zipcode: '',
  address: '',
  businessType: '',
  openYear: '',
  openMonth: '',
  ownerName: '',
  ownerImage: null,
  manager: '',
  parking: '',
  openTime: '',
  closeTime: '',
})

const resetForm = () => {
  Object.keys(formData.value).forEach(key => {
    formData.value[key] = null
  })
}

const submitForm = () => {
  console.log('등록된 데이터:', formData.value)
  // 여기에 실제 API 호출 구현
}
</script>

<!-- </template>

<script setup>
  import Form from '@/components/franchise/Form.vue'


</script> -->

<style  scoped>

</style>