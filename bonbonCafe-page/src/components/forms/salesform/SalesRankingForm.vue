<!-- src/components/forms/salesform/SalesRankingForm.vue -->
<template>
  <div class="mt-4 pa-10 Tdiv">
    <!-- 필터영역 -->
    <div class="" id="div0">
      <div id="div1">
        <!-- 시/도 -->
        <v-select
          v-model="selectedMajor"
          :items="regionStore.majors"
          item-title="name"
          item-value="code"
          placeholder="시/도"
          density="comfortable"
          variant="outlined"
          hide-details
          class="selectBox select-region"
        />
        <!-- 구/군 -->
        <v-select
          v-model="selectedSubCode"
          :items="regionStore.subs"
          item-title="name"
          item-value="code"
          placeholder="구/군"
          density="comfortable"
          variant="outlined"
          hide-details
          :disabled="!regionStore.subs.length"
          class="selectBox select-district"
        />
        <!-- 연도 -->
        <v-select
          v-model="year"
          :items="yearItems"
          item-title="label"
          item-value="value"
          placeholder="연도"
          density="comfortable"
          variant="outlined"
          hide-details
          class="selectBox select-year"
        />
        <!-- 월(선택) -->
        <v-select
          v-model="selectedMonth"
          :items="monthItems"
          item-title="label"
          item-value="value"
          placeholder="월"
          density="comfortable"
          variant="outlined"
          hide-details
          class="selectBox select-month"
        />
        <v-btn
          rounded="xl" 
          color="#D8DBBD"
          @click="onSearch"
          class="search-btn"
        >
          조회
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRegionStore }  from '@/stores/regionStore'
import { useRankingStore } from '@/stores/rankingStore'

const regionStore   = useRegionStore()
const rankingStore  = useRankingStore()

const selectedMajor   = ref(null)
const selectedSubCode = ref(null)
const year            = ref(null)
const selectedMonth   = ref(null)

// 연도 리스트 (현재 연도부터 과거 9년)
const currentYear = new Date().getFullYear()
const yearItems = Array.from({ length: 10 }, (_, i) => ({
  label: `${currentYear - i}년`,
  value: currentYear - i
}))

// 월 리스트
const monthItems = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}월`,
  value: i + 1
}))

onMounted(() => {
  regionStore.fetchMajors()
})

watch(selectedMajor, code => {
  selectedSubCode.value = null
  if (code != null) regionStore.fetchSubs(code)
})

async function onSearch() {
  if (!selectedMajor.value || !selectedSubCode.value || !year.value) {
    alert('시/도, 구/군, 연도는 필수 선택입니다.')
    return
  }
  await rankingStore.fetchRanking({
    regionCode: selectedSubCode.value,
    year:       year.value,
    month:      selectedMonth.value,
    page:       0,
    size:       10
  })
}
</script>

<style scoped>
.Tdiv {
  /* background-color: #F5F5F5; */
}
#div0 {
  display: flex;
  width: 100%;
}
#div1 {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-left: 170px;
  margin-bottom: 30px;
}
/* SelectBox 디자인 재현 */
.selectBox {
  background-color: white;
  height: 48px;

}
/* 너비는 필요에 따라 조절하세요 */
.select-region  { width: 180px; }
.select-district{ width: 180px; }
.select-year    { width: 120px; }
.select-month   { width: 120px; }
/* 조회 버튼도 높이를 맞춰줍니다 */
.search-btn {
  height: 48px;
  min-width: 80px;
  font-weight: bold;
}
</style>
