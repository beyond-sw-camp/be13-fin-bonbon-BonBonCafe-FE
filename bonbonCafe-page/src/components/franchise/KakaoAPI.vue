<template>
  <div>
    <div class="d-flex">
        <v-text-field v-model="postcode" label="우편번호" readonly class="mr-2 textBox" density="comfortable" variant="outlined" width="50px"/>
        <v-btn @click="execDaumPostcode" color="#efefef" class="mt-2">우편번호 찾기</v-btn>
    </div>
    <v-text-field v-model="address" label="주소" readonly density="comfortable" variant="outlined" class="textBox"/>
    <v-text-field 
      v-model="detailAddress" 
      @input="onDetailInput"
      label="상세주소" 
      density="comfortable" 
      variant="outlined" 
      class="textBox"
    />

    <!-- 카카오 주소 검색 레이어 -->
    <div id="layer" style="display:none;position:fixed;overflow:hidden;z-index:999;-webkit-overflow-scrolling:touch;">
      <img
        src="//t1.daumcdn.net/postcode/resource/images/close.png"
        id="btnCloseLayer"
        style="cursor:pointer;position:absolute;right:-3px;top:-3px;z-index:1"
        @click="closeDaumPostcode"
        alt="닫기 버튼"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['address-selected' , 'update-detail-address'])

const postcode = ref('')
const address = ref('')
const detailAddress = ref('')

let element_layer = null

onMounted(() => {
  element_layer = document.getElementById('layer')
})

function closeDaumPostcode() {
  if (element_layer) {
    element_layer.style.display = 'none'
  }
}


// 주소 검색 창을 열고, 사용자가 주소를 선택했을 떄의 후속 처리를 정의
function execDaumPostcode() {  
  new window.daum.Postcode({  // 카카오에서 제공하는 주소 검색 팝업을 삽입하는 객체
    oncomplete: function (data) { // 사용자가 주소를 선택했을 떄 자동으로 실행되는 콜백
      let addr = ''

      if (data.userSelectedType === 'R') {
        addr = data.roadAddress // 도로명 주소 선택 시
      } else {
        addr = data.jibunAddress  // 지번 주소 선택 시
      }

      postcode.value = data.zonecode  // 우변번호
      address.value = addr            // 선택된 주소 (도로명 또는 지번)

      
      // 주소를 선택한 후 자동으로 상세주소 입력란에 커서를 위치시킵
      setTimeout(() => {
        document.querySelector('input[label="상세주소"]')?.focus()
      }, 0)
      
   
      emit('address-selected', {
        regionName: `${data.sido} ${data.sigungu}`,  // "서울특별시 동작구"
        roadAddress: data.roadAddress,         // "보라매로 87"
      })
      
      element_layer.style.display = 'none'
    },
    width: '100%',
    height: '100%',
    maxSuggestItems: 5,
    shorthand: false
  }).embed(element_layer)

  element_layer.style.display = 'block'
  initLayerPosition()
}

const onDetailInput = () => {
  emit('update-detail-address', detailAddress.value)
}

function initLayerPosition() {
  const width = 300
  const height = 400
  const borderWidth = 5

  element_layer.style.width = `${width}px`
  element_layer.style.height = `${height}px`
  element_layer.style.border = `${borderWidth}px solid #ccc`
  element_layer.style.left = `${((window.innerWidth || document.documentElement.clientWidth) - width) / 2 - borderWidth}px`
  element_layer.style.top = `${((window.innerHeight || document.documentElement.clientHeight) - height) / 2 - borderWidth}px`
}
</script>

<style scoped>
.textBox{
  color: gray;
}
</style>
