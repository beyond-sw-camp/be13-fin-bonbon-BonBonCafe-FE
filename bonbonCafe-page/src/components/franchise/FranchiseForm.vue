 <template>
    <form @submit.prevent="handleSubmit">
        <v-table class="pa-0 d-flex">
        <tbody>
          <tr>
            <td class=" thead-title tb-bg"><span class="required">* </span> 가맹점 이름</td>
            <td class=""><input type="text"/></td>
            <td class=" thead-title"><span class="required">* </span> 점주 이름</td>
            <td class=""><input type="text"/></td>
          </tr>
          <tr>
            <td class=" thead-title "><span class="required">* </span> 가맹점 사진</td>
              <td colspan="1">
                <div class="ma-5 upload-box">사진 올리기</div>
                <input type="file" class="file-input" />
              </td>
            <td class=" thead-title"><span class="required">* </span> 점주 사진</td>
            <td colspan="1">
                <div class="upload-box">사진 올리기</div>
                <input type="file" class="file-input" />
              </td>
          </tr>
          <tr>
            <td class=" thead-title"><span class="required">* </span> 가맹점 전화번호</td>
            <td class=""><input type="tel"/></td>
            <td class=" thead-title"><span class="required">* </span> 담당자</td>
            <td>
              <select>
                <option disabled selected>선택</option>
                <option>홍길동</option>
              </select>
            </td>
          </tr>
          <tr>
            <td class="thead-title"><span class="required">* </span>우편 번호</td>
            <td>
              <input type="text" />
              <button class="search-btn">🔍</button>
            </td>
            <td class="thead-title">주차 가능</td>
            <td>
              <label><input type="checkbox" /> 가능</label>
              <label><input type="checkbox" /> 불가</label>
            </td>
          </tr>
          <tr>
            <td class=" thead-title"></td>
            <td class=" thead-title"><span class="required">* </span> 운영상태</td>
            <td class="">ddd</td>
          </tr>
          <tr>
            <td class=" thead-title"></td>
            <td class="">ddd</td>
            <td class=" thead-title"><span class="required">* </span> 운영 시간</td>
            <td class="">ddd</td>
          </tr>
          <tr>
            <td class=" thead-title"><span class="required">* </span> 개업 일자 </td>
            <td class="">ddd</td>
            <td class=" thead-title"> 좌석수</td>
            <td class="">ddd</td>
          </tr>
        </tbody>
        </v-table>
    </form>
</template>


<script setup>

</script>
<style scoped>
.thead-title{
  width: 120px; 
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: #efefef;
}

.franchise-register {
  background: #fdfcf6;
  padding: 30px;
  font-family: 'Pretendard', sans-serif;
}

.title {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 20px;
  color: #1a1a1a;
}

.register-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.register-table td {
  padding: 10px;
  vertical-align: middle;
}

.register-table input,
.register-table select {
  padding: 6px 10px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.upload-box {
  height: 200px;
  border: 2px dashed #ccc;
  text-align: center;
  padding: 20px;
  color: #aaa;
  background-color: #efefef;
  border-radius: 12px;
  cursor: pointer;
}

.required {
  color: red;
}

.search-btn {
  margin-left: 4px;
  background: #f1f1f1;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-wrap {
  margin-top: 30px;
  text-align: center;
}

.btn {
  padding: 10px 30px;
  margin: 0 10px;
  font-weight: 600;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

.submit {
  background-color: #b59f78;
  color: white;
}

.cancel {
  background-color: #f1f1f1;
  color: #333;
}

</style>