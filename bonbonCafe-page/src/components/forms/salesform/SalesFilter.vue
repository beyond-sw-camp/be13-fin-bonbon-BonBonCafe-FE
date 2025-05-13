<template>
  <v-row dense align="center" class="mb-4">
    <v-col cols="12" sm="3">
      <v-select v-model="selectedMajor" :items="regionStore.majors" label="시/도" clearable />
    </v-col>
    <v-col cols="12" sm="3">
      <v-select v-model="selectedSub" :items="regionStore.subs" item-title="name" item-value="code"
                label="구/군" clearable :disabled="!regionStore.subs.length" />
    </v-col>
    <v-col cols="12" sm="3">
      <v-select v-model="selectedFranchise" :items="regionStore.franchises" item-title="name" item-value="id"
                label="가맹점" clearable :disabled="!regionStore.franchises.length" />
    </v-col>
    <v-col cols="12" sm="3" class="text-right">
      <v-btn :disabled="!regionStore.selectedFranchise" color="primary" @click="apply">선택</v-btn>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRegionStore } from '@/stores/regionStore'

const regionStore = useRegionStore()
const emit = defineEmits(['select'])

const selectedMajor = computed({
  get: () => regionStore.selectedMajor,
  set: (val) => regionStore.selectedMajor = val
})

const selectedSub = computed({
  get: () => regionStore.selectedSub,
  set: (val) => regionStore.selectedSub = val
})

const selectedFranchise = computed({
  get: () => regionStore.selectedFranchise,
  set: (val) => regionStore.selectedFranchise = val
})

// 초기 시/도 목록 로드
onMounted(() => {
  regionStore.fetchMajors()
})

// 시/도 선택 시 구/군 목록 로드
watch(() => selectedMajor.value, (major) => {
  regionStore.selectedSub = null
  regionStore.franchises = []
  regionStore.selectedFranchise = null
  if (major) regionStore.fetchSubs(major)
})

// 구/군 선택 시 가맹점 목록 로드
watch(() => selectedSub.value, (code) => {
  regionStore.franchises = []
  regionStore.selectedFranchise = null
  if (code) regionStore.fetchFranchises(code)
})

// 4) “선택” 버튼 클릭 시 상위로 ID 전달
function apply() {
  emit('select', regionStore.selectedFranchise)
}
</script>
