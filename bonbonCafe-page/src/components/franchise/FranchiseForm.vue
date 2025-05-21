<template>
  <v-container class="container">
    <div class="franchiseTable">
      <div class="cell headerC" style="height: 70px;"><strong><span class="requierd">*</span>가맹점 이름</strong></div>
      <div class="cell"  style="height: 70px;">
        <v-text-field 
            density="comfortable"
            variant="outlined"
            class="textBox"
          />
      </div>
      <div class="cell headerC" style="height: 70px;"><strong><span class="requierd">*</span>점주 이름</strong></div>
      <div class="cell" style="height: 70px;">
        <v-text-field 
            density="comfortable"
            variant="outlined"
            class="textBox"
          />
      </div>

      <div class="cell headerC" style="height: 300px;"><strong><span class="requierd">*</span>가맹점 사진</strong></div>
      <div class="cell">
        <v-file-input
        class="image"
        accept="image/*"
        label="이미지 업로드"
        @change="onFranchiseImageChange"
      />
      <img
        v-if="franchiseImageUrl"
        :src="franchiseImageUrl"
        alt="가맹점 이미지 미리보기"
        class="preview-img"
      />
      </div>
      <div class="cell headerC"><strong><span class="requierd">*</span>점주 사진</strong></div>
      <div class="cell">
        <v-file-input
        class="image"
        accept="image/*"
        label="이미지 업로드"
        @change="onOwnerImageChange"
      />
      <img
        v-if="ownerImageUrl"
        :src="ownerImageUrl"
        alt="점주 이미지 미리보기"
        class="preview-img"
      />
      </div>

      <div class="cell headerC"  style="height: 70px;"><strong><span class="requierd">*</span>가맹점 연락처</strong></div>
      <div class="cell" style="height: 70px;">
        <v-text-field type="tel" density="comfortable" variant="outlined" class=" textBox" />
      </div>
      <div class="cell headerC" style="height: 70px;"><strong><span class="requierd">*</span>담당자</strong></div>
      <div class="cell" style="height: 70px;">
        <v-select
            :items="['홍길동']"
            placeholder="선택"
            density="comfortable"
            variant="outlined"
            class=" textBox"
          ></v-select>
      </div>

      <div class="cell headerC" style="height: 210px;"><strong><span class="requierd">*</span>주소</strong></div>
      <div class="cell"  style="height: 210px;">
        <KakaoAPI />
      </div>
      <div class="cell3 " style="height: 210px;">
        <div class="ma-0 pa-0">
          <div style="height: 70px; border: 1px solid #ccc; background-color: #efefef; color: gray; padding: 8px;">
            <strong><span class="requierd">*</span>개업 일자</strong>
          </div>
          <div style="height: 70px; border: 1px solid #ccc; background-color: #efefef; color: gray; padding: 8px;">
            <strong><span class="requierd">*</span>운영 상태</strong>
          </div>
          <div style="height: 70px; border: 1px solid #ccc; background-color: #efefef; color: gray; padding: 8px;">
            <strong><span class="requierd">*</span>운영 시간</strong>
          </div>
        </div>
      </div>
      <div class="cel3">
        <div>
          <div class="d-flex align-center" style="height: 70px; border: 1px solid #ccc; padding: 8px; padding-top: 30px;">
            <v-select
                    :items="['2023', '2024', '2025']" 
                    label="년" 
                    density="comfortable"
                    variant="outlined"
                    class=" textBox mr-2"

                  />
                  <v-select 
                    :items="['01', '02', '03']" 
                    label="월" 
                    density="comfortable"
                    variant="outlined"
                    class=" textBox mr-2"

                />
                  <v-select 
                    :items="['01', '02', '03']" 
                    label="일" 
                    density="comfortable"
                    variant="outlined"
                    class=" textBox "
                  />

          </div>
          <div class="d-flex align-center"  style="height: 70px; border: 1px solid #ccc; padding: 8px; padding-top: 30px">
            <v-checkbox label="운영 중" value="운영중" dense class="checkbox"></v-checkbox>
            <v-checkbox label="운영 중단" value="중단" dense class="checkbox"></v-checkbox>
          </div>
          <div class="d-flex align-center" style="height: 70px; border: 1px solid #ccc; padding: 8px; padding-top: 30px">
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
        </div>
      </div>

      <div class="cell headerC" style="height: 70px;"><strong><span class="requierd">*</span>주차 여부</strong></div>
      <div class="cell d-flex align-center" style="height: 70px;">
        <v-checkbox label="가능" value="가능" class="checkbox"/>
        <v-checkbox label="불가" value="불가" class="checkbox"/>

      </div>
      <div class="cell headerC" style="height: 70px;"><strong><span class="requierd">*</span>좌석수</strong></div>
      <div class="cell" style="height: 70px;">
        <v-text-field 
            type="number"
            density="comfortable"
            variant="outlined"
            class="textBox"
            dense
          />      

      </div>
  </div>

  </v-container>
  </template>

<script setup>
import KakaoAPI from './KakaoAPI.vue';

import { ref } from 'vue'

const franchiseImageUrl = ref(null)
const ownerImageUrl = ref(null)

const onFranchiseImageChange = (fileList) => {
  const file = fileList instanceof FileList ? fileList[0] : fileList
  if (file) {
    franchiseImageUrl.value = URL.createObjectURL(file)
  }
}

const onOwnerImageChange = (fileList) => {
  const file = fileList instanceof FileList ? fileList[0] : fileList
  if (file) {
    ownerImageUrl.value = URL.createObjectURL(file)
  }
}
</script>

<style scoped>
.container{
  display: flex;
  justify-content: center;
}
.franchiseTable {
  display: grid;
  grid-template-columns: 0.5fr 2fr 0.5fr 2fr; /* 6개의 열 */

  width: 85%;
  border: 1px solid #ccc;
  background-color: white;
}
.headerC{
  color: rgb(133, 132, 132);
  background-color: #efefef;
}
.cell {
  padding: 8px;
  text-align: start;
  border: 1px solid #ccc;
}

.requierd{
  color: red;
  margin-right: 2px;
}
/* .cell2{
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  text-align: start;
} */

.preview-img {
  margin-top: 10px;
  width: 150px;
  height: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.textBox{
  color: gray;
  /* margin-top: 20px; */
  /* border-radius: 0%; */
}
.checkbox{
  color: gray;
}
</style>
