<template>
  <v-form @submit.prevent="onSearch">
    <v-row dense align="center" class="mb-4">
      <!-- 1) 시/도 선택 -->
      <v-col cols="12" sm="3">
        <v-select
          v-model="selectedMajor"
          :items="regionStore.majors"
          item-title="name"
          item-value="code"
          label="시/도"
          clearable
          dense
        />
      </v-col>

      <!-- 2) 구/군 선택 -->
      <v-col cols="12" sm="3">
        <v-select
          v-model="selectedSubCode"
          :items="regionStore.subs"
          item-title="name"
          item-value="code"
          label="구/군"
          clearable
          dense
          :disabled="!regionStore.subs.length"
        />
      </v-col>

      <!-- 3) 연도 입력 -->
      <v-col cols="12" sm="2">
        <v-text-field
          v-model.number="year"
          label="연도"
          type="number"
          required
          dense
        />
      </v-col>

      <!-- 4) 월 선택 -->
      <v-col cols="12" sm="2">
        <v-select
          v-model.number="selectedMonth"
          :items="monthItems"
          item-title="text"
          item-value="value"
          label="월(선택)"
          clearable
          dense
        />
      </v-col>

      <!-- 5) 조회 버튼 -->
      <v-col cols="12" sm="2" class="text-right">
        <v-btn
          type="submit"
          color="primary"
          :disabled="!selectedSubCode || !year"
          dense
        >조회</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRegionStore }  from '@/stores/regionStore'
import { useRankingStore } from '@/stores/rankingStore'

const regionStore   = useRegionStore()
const rankingStore  = useRankingStore()

// 바인딩할 값들
const selectedMajor   = ref(null)            // 시/도 코드
const selectedSubCode = ref(null)            // 구/군 코드
const year            = ref(new Date().getFullYear())
const selectedMonth   = ref(null)            // 1~12

// 월 Select 아이템
const monthItems = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  text:  `${i + 1}월`
}))

// 초기: 시/도 목록 로드
onMounted(() => {
  regionStore.fetchMajors()
})

// 시/도가 바뀌면 subs 갱신
watch(selectedMajor, code => {
  selectedSubCode.value = null
  if (code != null) regionStore.fetchSubs(code)
})

// 조회 실행
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
