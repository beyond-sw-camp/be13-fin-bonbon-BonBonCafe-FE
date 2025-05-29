<template>
  <form @submit.prevent="SubmitEvent">
    <v-container class="py-8">
      <v-card elevation="2" class="pa-6 rounded-xl" style="border: 1px solid #ccc;">
        
        <v-row dense>
          <!-- 이름, 연락처, 주소 -->
          <v-col cols="12" md="6">

            <v-row class="align-center mb-3">
              <v-col cols="4" class="text-left">
                <v-label class="text-subtitle-1 font-weight-medium">* 가맹점 이름</v-label>
              </v-col>
              <v-col cols="8">
                <v-text-field 
                  v-model="form.name"
                  density="compact"
                  variant="outlined"
                  hide-details
                />
              </v-col>
            </v-row>

            <v-row class="align-center mb-3">
              <v-col cols="4" class="text-left">
                <v-label class="text-subtitle-1 font-weight-medium">* 가맹점 연락처</v-label>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="form.franchiseTel"
                  type="tel"
                  density="compact"
                  variant="outlined"
                  hide-details
                />
              </v-col>
            </v-row>

            <v-row class="align-center mb-1">
              <v-col cols="4" class="text-left">
                <v-label class="text-subtitle-1 font-weight-medium">* 주소</v-label>
              </v-col>
              <v-col cols="8" class="pa-0">
                <KakaoAPI @address-selected="onAddressSelected" @update-detail-address="receiveDetailAddress" />
              </v-col>
            </v-row>

          </v-col>

          <!-- 사진 + 미리보기 -->
          <!-- <v-col cols="12" md="6"> -->
            <!-- <v-file-input
              v-model="form.franchiseImage"
              accept="image/*"
              label="* 가맹점 사진 업로드"
              density="compact"
              variant="outlined"
              @change="onFranchiseImageChange"
            />
            <v-img
              v-if="franchiseImageUrl"
              :src="franchiseImageUrl"
              class="mt-3 rounded-lg"
              max-height="200"
              contain
            ></v-img> -->
            <v-col cols="12" md="6" class="d-flex flex-column align-center justify-center">
            <v-avatar size="120" class="mb-3">
              <v-img :src="franchiseImageUrl || defaultImage" cover />
            </v-avatar>
            <v-btn
              color="grey"
              size="small"
              class="mr-1 mb-2"
              outlined
              @click="$refs.fileInput.click()"
            >
              이미지 업로드
            </v-btn>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="onFranchiseImageChange($event.target.files)"
            />
          </v-col>
        </v-row>

        <!-- 하단 입력 영역 -->
        <v-row dense>

          <!-- 매장 평수 -->
        <v-col cols="12" md="4" class="mb-3">
          <v-label class="text-subtitle-1 font-weight-medium mb-1">* 매장 평수</v-label>
          <v-text-field
            v-model="form.storeSize"
            type="number"
            density="compact"
            variant="outlined"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="4" class="mb-3">
          <v-label class="text-subtitle-1 font-weight-medium mb-1">* 좌석수</v-label>
          <v-text-field
            v-model="form.seatingCapacity"
            type="number"
            density="compact"
            variant="outlined"
            hide-details
          />
        </v-col>

          <!-- 주차 여부 -->
          <v-col cols="12" md="4">
            <v-label class="text-subtitle-1 font-weight-medium mb-1">* 주차 여부</v-label>
            <v-radio-group v-model="form.parkingAvailability" row>
              <v-radio label="가능" :value="true" />
              <v-radio label="불가" :value="false" />
            </v-radio-group>
          </v-col>

          <!-- 개업 일자 -->
          <v-col cols="12" md="4">
            <v-label class="text-subtitle-1 font-weight-medium mb-1">* 개업 일자</v-label>
            <v-row dense>
              <v-col cols="4">
                <v-select
                  :items="['2023', '2024', '2025']"
                  v-model="form.openYear"
                  label="년"
                  density="compact"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="4">
                <v-select
                  :items="['01','02','03','04','05','06','07','08','09','10','11','12']"
                  v-model="form.openMonth"
                  label="월"
                  density="compact"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="4">
                <v-select
                  :items="Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))"
                  v-model="form.openDay"
                  label="일"
                  density="compact"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-col>

          <!-- 운영 상태 -->
          <v-col cols="12" md="4">
            <v-label class="text-subtitle-1 font-weight-medium mb-1">* 운영 상태</v-label>
            <v-radio-group v-model="form.status" row>
              <v-radio label="정상 운영" value="OPERATING" />
              <v-radio label="휴점" value="PAUSED" />
              <v-radio label="폐점" value="CLOSED" />
            </v-radio-group>
          </v-col>

          <!-- 운영 시간 -->
          <v-col cols="12" md="4">
            <v-label class="text-subtitle-1 font-weight-medium mb-1">* 운영 시간</v-label>
            <v-row dense>
              <v-col cols="5">
                <v-text-field
                  v-model="form.openTime"
                  type="time"
                  density="compact"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="2" class="d-flex align-center justify-center">
                <span>~</span>
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="form.closeTime"
                  type="time"
                  density="compact"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- 제출 버튼 -->
        <v-row justify="center">
          <v-btn type="submit" color="primary" class="mt-6" size="large" rounded>제출</v-btn>
        </v-row>

      </v-card>
    </v-container>
  </form>
</template>



<script setup>
import KakaoAPI from './KakaoAPI.vue';
import { ref,reactive } from 'vue'

const defaultImage = 'https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/profile-default.jpg';

const form = reactive({
  name: '',
  regionName: '',
  franchiseTel: '',
  roadAddress: '',
  detailAddress: '',
  openDate: '',
  openYear: '',
  openMonth: '',
  openDay: '',
  openTime: '',
  closeTime: '',
  openHours: '',
  franchiseImage: '',
  storeSize: 0,
  seatingCapacity: 0,
  parkingAvailability: false,
  status: 'OPERATING',
});


const franchiseImageUrl = ref(null);
const emit = defineEmits(['submit']);

function SubmitEvent() {
  form.openDate = `${form.openYear}-${form.openMonth}-${form.openDay}`;
  form.openHours = `${form.openTime}~${form.closeTime}`;
  emit('submit', form)
};



const onFranchiseImageChange = (fileList) => {
  const file = fileList instanceof FileList ? fileList[0] : fileList;
  if (file) {
    franchiseImageUrl.value = URL.createObjectURL(file);  // 미리보기용
    form.franchiseImage = file.name;                      // 이름만 저장
  } else {
    franchiseImageUrl.value = null;
    form.franchiseImage = '';
  }
};


function onAddressSelected({ roadAddress, regionName }) {
  
  form.roadAddress = roadAddress
  form.regionName = regionName
};

const receiveDetailAddress = (detailAddress) => {
  form.detailAddress = detailAddress
}

</script>

<style scoped>

</style>
