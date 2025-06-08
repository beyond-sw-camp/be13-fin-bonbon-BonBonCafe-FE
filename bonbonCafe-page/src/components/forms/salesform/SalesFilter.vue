<template>
  <!-- 상단 필터 영역 -->
  <div class="mb-16" id="div0">
    <div id="div1">
      <!-- 1) 시/도 선택: majors는 ["서울특별시", "경기도", …] 형태 -->
      <SelectBox
        class="select-region"
        v-model="selectedMajorObj"
        :items="majorItems"               
        placeholder="시/도 선택"
        clearable
      />

      <!-- 2) 구/군 선택: subs는 [{ code, name }, …] 형태 -->
      <SelectBox
        class="select-district"
        v-model="selectedSubObj"
        :items="subItems"                  
        placeholder="구/군 선택"
        clearable
        :disabled="!regionStore.subs.length"
      />

      <!-- 3) 가맹점 선택: franchises는 [{ id, name }, …] 형태 -->
      <SelectBox
        class="select-franchise"
        v-model="selectedFranchiseObj"
        :items="franchiseItems"            
        placeholder="가맹점 선택"
        clearable
        :disabled="!regionStore.franchises.length"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import SelectBox from '@/components/franchise/Select.vue'
import { useRegionStore } from '@/stores/regionStore'

// Pinia regionStore
const regionStore = useRegionStore()

const majorItems = computed(() => {
  return regionStore.majors.map((majorStr) => ({
    title: majorStr,
    value: majorStr
  }))
})

const subItems = computed(() => {
  return regionStore.subs.map((subObj) => ({
    title: subObj.name,
    value: subObj.code
  }))
})

const franchiseItems = computed(() => {
  return regionStore.franchises.map((frObj) => ({
    title: frObj.name,
    value: frObj.id
  }))
})

// 로컬 ref들: v-model에 바인딩할 값
const selectedMajor = ref(null)
const selectedSub = ref(null)
const selectedFranchise = ref(null)

// “시/도” 객체 ↔ 문자열 매핑을 위한 computed
const selectedMajorObj = computed({
  get() {
    return majorItems.value.find(item => item.value === selectedMajor.value) || null
  },
  set(obj) {
    selectedMajor.value = obj ? obj.value : null
  }
})

// “구/군” 객체 ↔ 숫자 코드 매핑을 위한 computed
const selectedSubObj = computed({
  get() {
    return subItems.value.find(item => item.value === selectedSub.value) || null
  },
  set(obj) {
    selectedSub.value = obj ? obj.value : null
  }
})

// “가맹점” 객체 ↔ 숫자 ID 매핑을 위한 computed
const selectedFranchiseObj = computed({
  get() {
    return franchiseItems.value.find(item => item.value === selectedFranchise.value) || null
  },
  set(obj) {
    selectedFranchise.value = obj ? obj.value : null
  }
})

// 부모 컴포넌트로 가맹점 ID를 전달하기 위한 emit
const emit = defineEmits(['select'])

// 화면 진입 시: “시/도” 목록 로드
onMounted(() => {
  regionStore.fetchMajors()
})

// “시/도” 선택 시: Pinia에 저장 + 구/군 초기화 + fetchSubs 호출
watch(
  selectedMajor,
  (newMajorVal) => {
    regionStore.selectedMajor = newMajorVal
    selectedSub.value = null
    regionStore.subs = []
    selectedFranchise.value = null
    regionStore.franchises = []

    if (newMajorVal) {
      regionStore.fetchSubs(newMajorVal)
    }
  },
  { immediate: true }
)

// “구/군” 선택 시: Pinia에 저장 + 가맹점 초기화 + fetchFranchises 호출
watch(
  selectedSub,
  async (newSubVal) => {
    regionStore.selectedSub = newSubVal
    selectedFranchise.value = null
    regionStore.franchises = []

    if (newSubVal !== null) {
      await regionStore.fetchFranchises(newSubVal)
    }
  }
)

// “가맹점” 선택 시: Pinia에 저장 + 부모로 emit
watch(
  selectedFranchise,
  (newFranchiseId) => {
    console.log('[SalesFilter.vue] selectedFranchise →', newFranchiseId)  
    regionStore.selectedFranchise = newFranchiseId

    if (newFranchiseId !== null) {
      console.log('[SalesFilter.vue] emit select →', newFranchiseId)
      emit('select', newFranchiseId)
    }
  }
)
</script>

<style scoped>
#div0 {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 16px;
}
#div1 {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
}
.select-region {
  width: 200px;
}
.select-district {
  width: 150px;
}
.select-franchise {
  width: 200px;
}
</style>
