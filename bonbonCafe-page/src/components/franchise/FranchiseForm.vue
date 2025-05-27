<template>
  <v-form ref="formRef" @submit.prevent="SubmitEvent">
    <v-container class="">
      <v-card elevation="2" class="pa-6 rounded-lg" style="border: 1px solid #ccc;">
        <!-- 기본 정보 -->
        <v-row dense>
          <v-col cols="12" md="6">
            <v-row class="align-center mb-3">
              <v-col cols="4"><label>* 가맹점 이름</label></v-col>
              <v-col cols="8">
                <v-text-field v-model="form.name" :readonly="props.readonly" :rules="props.readonly ? [] : [v => !!v || '가맹점 이름은 필수입니다']" density="compact" variant="outlined" hide-details />
              </v-col>
            </v-row>

            <v-row class="align-center mb-3">
              <v-col cols="4"><label>* 가맹점 연락처</label></v-col>
              <v-col cols="8">
                <v-text-field v-model="form.franchiseTel" type="tel" :readonly="props.readonly" :rules="props.readonly ? [] : [v => !!v || '연락처는 필수입니다']" density="compact" variant="outlined" hide-details @input="onTelInput" />
              </v-col>
            </v-row>

            <v-row class="align-center mb-1">
              <v-col cols="4"><label>* 주소</label></v-col>
              <v-col cols="8" class="pa-0">
                <template v-if="!props.readonly && props.mode !== 'edit'">

                  <KakaoAPI @address-selected="onAddressSelected" @update-detail-address="receiveDetailAddress" class="tt"/>
                </template>
                <template v-else>
                  <v-text-field v-model="form.roadAddress" label="주소" readonly density="compact" variant="outlined" hide-details class="mb-2" :rules="[v => !!v || '주소는 필수입니다']" />
                  <v-text-field v-model="form.detailAddress" label="상세주소" readonly density="compact" variant="outlined" hide-details />
                </template>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" md="6" class="d-flex flex-column align-center justify-center">
            <v-avatar size="250" class="mb-3">
              <v-img :src="franchiseImageUrl || defaultImage" cover />
            </v-avatar>
            <v-btn v-if="!props.readonly" color="grey" size="small" outlined @click="$refs.fileInput.click()">이미지 업로드</v-btn>
            <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="onFranchiseImageChange($event.target.files)" />
          </v-col>
        </v-row>

        <!-- 하단 정보 -->
        <v-row dense>
          <!-- 개업일자 -->
          <v-col cols="6">
            <v-row class="align-center">
              <v-col cols="4"><label>* 개업일자</label></v-col>
              <v-col cols="8">
                <template v-if="!props.readonly && props.mode !== 'edit'">
                  <v-row dense>
                    <v-col cols="4">
                      <v-select 
                        :items="years" 
                        v-model="form.openYear" 
                        label="년" 
                        density="compact" 
                        variant="outlined"
                        :rules="[v => !!v || '년 선택']" 
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-select 
                        :items="months" 
                        v-model="form.openMonth" 
                        label="월" 
                        density="compact" 
                        variant="outlined"
                        :rules="[v => !!v || '월 선택']" />
                    </v-col>
                    <v-col cols="4">
                      <v-select 
                        :items="days" 
                        v-model="form.openDay" 
                        label="일" 
                        density="compact" 
                        variant="outlined"
                        :rules="[v => !!v || '일 선택']" />
                    </v-col>
                    
                  </v-row>
                </template>
                <template v-else>
                  <v-text-field
                    :model-value="form.openDate"
                    readonly
                    variant="outlined"
                    density="compact"
                  />
                </template>
              </v-col>
            </v-row>
          </v-col>

          <!-- 운영 상태 -->
          <v-col cols="6" >
            <v-row class="align-center">
              <v-col cols="4" class=""><label>* 운영 상태</label></v-col>
              <v-col cols="8">
                <v-radio-group v-model="form.status" :disabled="props.readonly">
                  <v-row no-gutters>
                    <v-col cols="auto">
                      <v-radio label="정상 운영" value="OPERATING" />
                    </v-col>
                    <v-col cols="auto">
                      <v-radio label="휴점" value="PAUSED" />
                    </v-col>
                    <v-col cols="auto">
                      <v-radio label="폐점" value="CLOSED" />
                    </v-col>
                  </v-row>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-col>

          <!-- 운영 시간 -->
          <v-col cols="6">
            <v-row class="align-center">
              <v-col cols="4"><label>* 운영 시간</label></v-col>
              <v-col cols="8">
                <template v-if="!props.readonly">
                  <v-row dense>
                    <v-col cols="5">
                      <v-text-field v-model="form.openTime" type="time" density="compact" variant="outlined"
                        :rules="[v => !!v || '시작 시간 필수']" />
                    </v-col>
                    <v-col cols="2" class="d-flex align-center justify-center"><span>~</span></v-col>
                    <v-col cols="5">
                      <v-text-field v-model="form.closeTime" type="time" density="compact" variant="outlined"
                        :rules="[v => !!v || '종료 시간 필수']" />
                    </v-col>
                  </v-row>
                </template>
                <template v-else>
                  <v-text-field
                    v-if="props.readonly"
                    :model-value="form.openHours"
                    readonly
                    variant="outlined"
                    density="compact"
                  />
                </template>
              </v-col>
            </v-row>
          </v-col>

          <!-- 주차 여부 -->
          <v-col cols="6">
            <v-row class="align-center">
              <v-col cols="4"><label>* 주차 여부</label></v-col>
              <v-col cols="8">
                 <v-radio-group v-model="form.parkingAvailability" :disabled="props.readonly">
                  <v-row no-gutters>
                    <v-col cols="auto">
                      <v-radio label="가능" :value="true" />
                    </v-col>
                    <v-col cols="auto">
                      <v-radio label="불가" :value="false" />
                    </v-col>
                  </v-row>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-col>

          <!-- 매장 평수 -->
          <v-col cols="6">
            <v-row class="align-center">
              <v-col cols="4"><label>* 매장 평수</label></v-col>
              <v-col cols="8">
                <v-text-field v-model="form.storeSize" type="number" :readonly="props.readonly"
                  :rules="props.readonly ? [] : [v => !!v || '매장 평수는 필수입니다']"
                  density="compact" variant="outlined" hide-details />
              </v-col>
            </v-row>
          </v-col>

          <!-- 좌석 수 -->
          <v-col cols="6">
            <v-row class="align-center">
              <v-col cols="4"><label>* 좌석 수</label></v-col>
              <v-col cols="8">
                <v-text-field v-model="form.seatingCapacity" type="number" :readonly="props.readonly"
                  :rules="props.readonly ? [] : [v => !!v || '좌석 수는 필수입니다']"
                  density="compact" variant="outlined" hide-details />
              </v-col>
            </v-row>
          </v-col>
        </v-row>


        <v-row justify="center" v-if="props.submitVisible">
          <v-btn type="submit" color="#D8DBBD" class="mt-6" size="large" style="color: #6F6F6F;" rounded>제출</v-btn>
          <v-btn color="#efefef" class="mt-6 mx-2" size="large" rounded @click="emit('back')">뒤로가기</v-btn>
        </v-row>
        <!-- 읽기 전용일 때 하단 버튼 -->
        <v-row justify="center" v-if="props.readonly">
          <v-btn color="#D8DBBD" class="mt-6 mx-2" size="large" style="color: #6F6F6F;" rounded @click="emit('edit')">수정</v-btn>
          <v-btn color="#FC6161" class="mt-6 mx-2" size="large" style="color: #6F6F6F;" rounded @click="emit('delete')">삭제</v-btn>
          <v-btn color="#efefef" class="mt-6 mx-2" size="large" style="color: #6F6F6F;" rounded @click="emit('back')">뒤로가기</v-btn>
        </v-row>

      </v-card>
    </v-container>
  </v-form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import KakaoAPI from './KakaoAPI.vue'

const props = defineProps({
  initialFormData: {
    type: Object,
    default: () => ({}),
  },
  franchiseId: { type: [String, Number], required: false },  // 추가
  submitVisible: { 
    type: Boolean,
    default: true 
  },
  readonly: { 
    type: Boolean,
    default: false 
  },
  mode:{
    type: String,
    default: 'create'
  },
})
const emit = defineEmits(['create', 'edit', 'delete', 'back'])



const defaultImage = 'https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/profile-default.jpg'
const franchiseImageUrl = ref(null)
const fileInput = ref(null)
const formRef = ref(null)

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
})

const years = ['2023', '2024', '2025']
const months = ['01','02','03','04','05','06','07','08','09','10','11','12']
const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))

watch(() => props.initialFormData, (newVal) => {
  if (newVal) {
    Object.assign(form, newVal)
    franchiseImageUrl.value = newVal.franchiseImageUrl || null
  }
}, { immediate: true })

function SubmitEvent() {
  if (props.readonly) return;

  formRef.value.validate().then(success => {
    console.log('validate result:', success);
    if (success) {
      if (props.mode === 'create') {
        // 등록일 경우 모든 데이터 전달
        form.openDate = `${form.openYear}-${form.openMonth.padStart(2, '0')}-${form.openDay.padStart(2, '0')}`;
        form.openHours = `${form.openTime}~${form.closeTime}`;
         console.log('create mode - emitting:', { ...form });
        emit('submit', { ...form });

      } else if (props.mode === 'edit') {
        // 수정일 경우 일부 데이터만 전달
        const updatedata = {
          franchiseTel: form.franchiseTel,
          storeSize: form.storeSize,
          seatingCapacity: form.seatingCapacity,
          parkingAvailability: form.parkingAvailability,
          openHours: `${form.openTime}~${form.closeTime}`,
          status: form.status,
        };
        emit('submit', updatedata);
      }
    }
  });
}

function onFranchiseImageChange(fileList) {
  const file = fileList instanceof FileList ? fileList[0] : fileList
  if (file) {
    franchiseImageUrl.value = URL.createObjectURL(file)
    form.franchiseImage = file.name
  } else {
    franchiseImageUrl.value = null
    form.franchiseImage = ''
  }
}

function onAddressSelected({ roadAddress, regionName }) {
  form.roadAddress = roadAddress
  form.regionName = regionName
}

function receiveDetailAddress(detailAddress) {
  form.detailAddress = detailAddress
}


function onTelInput(e) {

  let value = e.target.value.replace(/\D/g, '')  // 숫자만 남기기

  if (value.length <= 3) {
    form.franchiseTel = value
  } else if (value.length <= 7) {
    form.franchiseTel = value.slice(0, 3) + '-' + value.slice(3)
  } else if (value.length <= 11) {
    form.franchiseTel = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7)
  } else {
    form.franchiseTel = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11)
  }
}

</script>

<style scoped>
/* .custom-height{
  height: 47.99px;
} */
.tt{
  margin-left: 10px;
  margin-right: 8px;
}

/* .v-input--density-compact{
    --v-input-padding-top: 8px;
 } */


 .v-input--density-compact {
    --v-input-control-height: 47.99px;
    --v-input-padding-top: 8px;
}
</style> 