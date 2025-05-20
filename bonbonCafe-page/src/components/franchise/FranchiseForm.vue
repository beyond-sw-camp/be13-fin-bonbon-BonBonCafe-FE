
<template>
  <v-container class="pa-0">
    <v-table class="franchise-register">
      <tbody>
        <tr>
          <td class="title"><span class="required">*</span> 가맹점 이름</td>
          <td>
            <v-text-field 
              density="comfortable"
              variant="outlined"
              class="textBox"
            />
          </td>
          <td class="title"><span class="required">*</span> 점주 이름</td>
          <td>
            <v-text-field 
              density="comfortable"
              variant="outlined"
              class="textBox"
            />
          </td>
        </tr>
        <tr>
          <td class="title"><span class="required">*</span> 매장 사진</td>
          <td><v-file-input prepend-icon="mdi-camera" dense></v-file-input></td>
          <td class="title"><span class="required">*</span> 점주 사진</td>
          <td><v-file-input prepend-icon="mdi-camera" dense></v-file-input></td>
        </tr>
        <tr>
          <td class="title"><span class="required">*</span> 매장 전화번호</td>
          <td>
            <v-text-field
              type="tel"
              density="comfortable"
              variant="outlined"
              class=" textBox"
            />
          </td>
          <td class="title"><span class="required">*</span> 담당자</td>
          <td>
            <v-select
              :items="['홍길동']"
              placeholder="선택"
              density="comfortable"
              variant="outlined"
              class=" textBox"
            ></v-select>
          </td>
        </tr>
        <tr>
          <td class="title" ><span class="required">*</span> 주소</td>
          <td colspan="" >
            <KakaoAPI/>
          </td>
          <td class="title"><span class="required">*</span> 운영 시간</td>
          <td colspan="3">
            <div class="d-flex align-center">
              <v-text-field 
                type="time" 
                density="comfortable"
                variant="outlined"
                class="mr-2 textBox"
              />
              <span class="mx-2">~</span>
              <v-text-field
                type="time" 
                density="comfortable"
                variant="outlined"
                class=" textBox"
              />
            </div>
          </td>
        </tr>
      
        <tr>
          <td class="title"><span class="required">*</span> 주차 여부</td>
          <td>
            <v-row no-gutters>
              <v-col cols="6"><v-checkbox label="가능" value="가능"/></v-col>
              <v-col cols="6"><v-checkbox label="불가" value="불가"/></v-col>
            </v-row>
          </td>
          <td class="title"><span class="required">*</span> 개업 일자</td>
          <td>
            <v-row no-gutters>
              <v-col cols="3">
                <v-select
                  :items="['2023', '2024', '2025']" 
                  label="년" 
                  density="comfortable"
                  variant="outlined"
                  class=" textBox mr-2"

                />
              </v-col>
              <v-col cols="3">
                <v-select 
                  :items="['01', '02', '03']" 
                  label="월" 
                  density="comfortable"
                  variant="outlined"
                  class=" textBox mr-2"

              />
              </v-col>
              <v-col cols="3">
                <v-select 
                  :items="['01', '02', '03']" 
                  label="일" 
                  density="comfortable"
                  variant="outlined"
                  class=" textBox"

                />
              </v-col>
            </v-row>
          </td>
        </tr>
        <tr>
          <td class="title"><span class="required">*</span> 운영 상태</td>
          <td>
            <v-row no-gutters>
              <v-col cols="6"><v-checkbox label="운영 중" value="운영중" dense></v-checkbox></v-col>
              <v-col cols="6"><v-checkbox label="운영 중단" value="중단" dense></v-checkbox></v-col>
            </v-row>
          </td>
          <td class="title"><span class="required">*</span> 좌석수</td>
          <td>
            <v-text-field 
              type="number"
              density="comfortable"
              variant="outlined"
              class="mr-2 textBox"
              dense
            />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup>
import KakaoAPI from './KakaoAPI.vue'
import { ref, onMounted } from 'vue'

// 주소 관련 변수들 선언
const postcode = ref('')
const address = ref('')
const detailAddress = ref('')
const extraAddress = ref('')
const elementWrap = ref(null)

// 페이지 마운트 후 스크립트 동적 삽입 (한 번만)
onMounted(() => {
  if (!window.daum?.Postcode) {
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    document.head.appendChild(script)
  }
})

function foldDaumPostcode() {
  if (elementWrap.value) {
    elementWrap.value.style.display = 'none'
  }
}

function execDaumPostcode() {
  const currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop)

  new window.daum.Postcode({
    oncomplete: function (data) {
      let fullAddr = '' // 최종 주소
      let extra = ''    // 참고항목

      if (data.userSelectedType === 'R') {
        fullAddr = data.roadAddress
      } else {
        fullAddr = data.jibunAddress
      }

      if (data.userSelectedType === 'R') {
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extra += data.bname
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extra += (extra !== '' ? ', ' + data.buildingName : data.buildingName)
        }
        if (extra !== '') {
          extra = ' (' + extra + ')'
        }
      }

      postcode.value = data.zonecode
      address.value = fullAddr
      extraAddress.value = extra
      detailAddress.value = ''

      elementWrap.value.style.display = 'none'
      document.body.scrollTop = currentScroll
    },
    onresize: function (size) {
      elementWrap.value.style.height = size.height + 'px'
    },
    width: '100%',
    height: '100%'
  }).embed(elementWrap.value)

  elementWrap.value.style.display = 'block'
}
</script>





<style scoped>
.franchise-register {
  background-color: #ffffff;
}
.title{
  background-color: #efefef;
  width: 130px;
}

.required {
  color: red;
}
.textBox{
  color: gray;
  margin-top: 20px;
  margin-bottom: 0px;

}

td {
  vertical-align: middle;
}
</style>
