<template>
  <v-container class="franchise-register pa-8">
    <v-row >
      <v-col cols="2" class="headerCol border border-grey-lighten2"><span class="required">*</span> 가맹점 이름</v-col>
      <v-col cols="4" class="bodyCol border border-grey-lighten2">
        <v-text-field 
          density="comfortable"
          variant="outlined"
          class="textBox"
        />
      </v-col>
      <v-col cols="2" class="headerCol border border-grey-lighten2"><span class="required">*</span> 점주 이름</v-col>
      <v-col cols="4" class="bodyCol border border-grey-lighten2">
        <v-text-field 
          density="comfortable"
          variant="outlined"
          class="textBox"
        />
      </v-col>
    </v-row>


    <v-row>
      <v-col cols="2" class="headerCol border border-grey-lighten2"><span class="required">*</span> 매장 사진</v-col>
      <v-col cols="4" class="bodyCol border border-grey-lighten2">
        <v-file-input class="image"/>
      </v-col>
      <v-col cols="2" class="headerCol border border-grey-lighten2"><span class="required">*</span> 점주 사진</v-col>
      <v-col  class="bodyCol border border-grey-lighten2">
        <v-file-input class="image"/>
      </v-col>
    </v-row>




    <v-row>
      <v-col cols="2" class="headerCol border border-grey-lighten2"><span class="required">*</span> 매장 전화번호</v-col>
      <v-col  class="bodyCol border border-grey-lighten2">
        <v-text-field
          type="tel"
          density="comfortable"
          variant="outlined"
          class=" textBox"
        />
      </v-col>
      <v-col cols="2" class="headerCol border border-grey-lighten2"><span class="required">*</span> 담당자</v-col>
      <v-col  class="bodyCol border border-grey-lighten2">
        <v-select
          :items="['홍길동']"
          placeholder="선택"
          density="comfortable"
          variant="outlined"
          class=" textBox"
        ></v-select>
      </v-col>
    </v-row>

    
    <v-row >
      <v-col cols="2" class="headerCol border border-grey-lighten2" ><span class="required">*</span> 주소</v-col>
      <v-col cols="4"  class="bodyCol border border-grey-lighten2">
        <KakaoAPI/>
      </v-col>

      
      <v-col  class="bodyCol  border border-grey-lighten2">
        <v-row >
          <v-col cols="4" class="headerCol  border border-grey-lighten2"><span class="required">*</span> 운영 시간</v-col>
          <v-col cols="8" class=" border border-grey-lighten2" >
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
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" class="headerCol  border border-grey-lighten2"><span class="required">*</span> 운영 상태</v-col>
          <v-col  cols="8" class=" border border-grey-lighten2">
            <v-row no-gutters>
              <v-col cols="6"><v-checkbox label="운영 중" value="운영중" dense></v-checkbox></v-col>
              <v-col cols="6"><v-checkbox label="운영 중단" value="중단" dense></v-checkbox></v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4" class="headerCol  border border-grey-lighten2 "><span class="required">*</span> 개업 일자</v-col>
          <v-col  cols="8"  class="bodyCol  border border-grey-lighten2 ">
            <v-row >
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
          </v-col>
        </v-row>
      </v-col>
    </v-row>


  
    <v-row >
      <v-col cols="2" class="headerCol  border border-grey-lighten2"><span class="required">*</span> 주차 여부</v-col>
      <v-col cols="4" class="bodyCol  border border-grey-lighten2">
        <v-row no-gutters>
          <v-col cols="3"><v-checkbox label="가능" value="가능"/></v-col>
          <v-col cols="3"><v-checkbox label="불가" value="불가"/></v-col>
        </v-row>
      </v-col>
      <v-col cols="2" class="headerCol  border border-grey-lighten2"><span class="required">*</span> 좌석수</v-col>
      <v-col cols="4"  class="bodyCol  border border-grey-lighten2">
        <v-text-field 
          type="number"
          density="comfortable"
          variant="outlined"
          class="textBox"
          dense
        />
      </v-col>
    </v-row>
     
      
  </v-container>
</template>

<script setup>
import KakaoAPI from './KakaoAPI.vue'


</script>

<style scoped>

.franchise-register{
  width: 1400px;
}
.headerCol{
  display: flex;
  align-items: center;
  justify-content: starts;
  /* width: 120px; */
  background-color: #efefef;
}
.bodyCol{
  background-color: #ffffff;
  

}

.required {
  color: red;
  margin-right: 2px;
}
.textBox{
  color: gray;
  margin-top: 20px;
  margin-bottom: 0px;
}

</style>