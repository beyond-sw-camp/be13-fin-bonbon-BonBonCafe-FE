<template>
  <v-container class="pa-0">


   
    
    <form @submit.prevent="handleSubmit">
      <v-container>
        <v-table class="d-flex">
        <tbody>
          <tr>
            <td class="test-left thead-title tb-bg">* 가맹점 이름</td>
            <td class="test-left">ddd</td>
            <td class="test-left thead-title">* 점주 이름</td>
            <td class="test-left">ddd</td>
          </tr>
          <tr>
            <td class="test-left thead-title ">* 가맹점 사진</td>
            <td class="test-left">
              <v-file-input
                :rules="rules"
                accept="image/png, image/jpeg, image/bmp"
                label="Photos"
                placeholder="Upload your photos"
                prepend-icon="mdi-camera"
                multiple
            ></v-file-input>

            </td>
            <td class="test-left thead-title">* 점주 사진</td>
            <td class="test-left">ddd</td>
          </tr>
          <tr>
            <td class="test-left thead-title">* 가맹점 전화번호</td>
            <td class="test-left">ddd</td>
            <td class="test-left thead-title">* 담당자</td>
            <td class="test-left">ddd</td>
          </tr>
          <tr>
            <td class="test-left thead-title">* 주소</td>
            <td class="test-left" rowspan="2">
                <v-text-field
                  append-inner-icon="mdi-map-marker"
                  label="도로명 입력"
                ></v-text-field>
              </td>
            <td class="test-left thead-title">* 주차 가능 여부</td>
            <td class="test-left">ddd</td>
          </tr>
          <tr>
            <td class="test-left thead-title"></td> <!-- 이 부분은 rowspan 때문에 의미 없음 -->
            <td class="test-left thead-title">* 운영상태</td>
            <td class="test-left">ddd</td>
          </tr>
          <tr>
            <td class="test-left thead-title">* 사업자 번호</td>
            <td class="test-left">ddd</td>
            <td class="test-left thead-title">* 운영 시간</td>
            <td class="test-left">ddd</td>
          </tr>
          <tr>
            <td class="test-left thead-title">* 개업 일자 </td>
            <td class="test-left">ddd</td>
            <td class="test-left thead-title">* 좌석수</td>
            <td class="test-left">ddd</td>
          </tr>
        </tbody>
        </v-table>
      </v-container>
    </form>



  </v-container>
</template>

<script setup>

</script>

<style  scoped>
.thead-title{
  width: 120px; /* 원하는 너비 */
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: #efefef;
}

</style>