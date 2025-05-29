<template>
  <div>
    <div class="d-flex">
        <v-text-field v-model="postcode" label="우편번호" readonly class="mr-2 textBox" density="comfortable" variant="outlined" width="50px"/>
        <v-btn @click="execDaumPostcode" color="#efefef" class="mt-2">우편번호 찾기</v-btn>
    </div>
    <v-text-field v-model="address" label="주소" readonly density="comfortable" variant="outlined" class="textBox"/>
    <v-text-field v-model="detailAddress" label="상세주소" density="comfortable" variant="outlined" class="textBox"/>

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

const emit = defineEmits(['address-selected'])

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

function execDaumPostcode() {
  new window.daum.Postcode({
    oncomplete: function (data) {
      let addr = ''

      if (data.userSelectedType === 'R') {
        addr = data.roadAddress
      } else {
        addr = data.jibunAddress
      }

      postcode.value = data.zonecode
      address.value = addr
      // detailAddress.value = ''

      // 부모 컴포넌트에 전달
      emit('address-selected', {
        regionName: `${data.sido} ${data.sigungu}`,  // "서울특별시 동작구"
        roadAddress: data.roadAddress,         // "보라매로 87"
        detailAddress: detailAddress.value
      })

      // 커서를 상세주소로 이동
      setTimeout(() => {
        document.querySelector('input[label="상세주소"]')?.focus()
      }, 0)

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
