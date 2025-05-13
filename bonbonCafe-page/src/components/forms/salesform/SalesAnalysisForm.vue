<template>
  <v-container fluid>
    <sales-filter @select="onFranchiseSelect" />

    <v-row dense align="center" class="mb-4">
      <v-col cols="12" sm="4">
        <v-date-input v-model="startDate" label="시작 날짜" variant="solo-inverted"
                      format="YYYY-MM-DD" model-format="YYYY-MM-DD" locale="ko" clearable dense />
      </v-col>
      <v-col cols="12" sm="4">
        <v-date-input v-model="endDate" label="종료 날짜" variant="solo-inverted"
                      format="YYYY-MM-DD" model-format="YYYY-MM-DD" locale="ko" clearable dense />
      </v-col>
      <v-col cols="12" sm="4" class="text-right">
        <v-btn color="primary" @click="onSearch">매출 조회</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <menu-ranking-chart :ranking="salesStore.menuRanking" />
      </v-col>

      <v-col cols="12" md="6" v-show="hasData">
        <v-card class="pa-4 elevation-1 rounded-lg">
          <v-card-title>일별 매출 분석</v-card-title>
          <v-card-text>
            <canvas ref="chartRef"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div class="text-center text--secondary" v-show="!hasData">
      가맹점과 기간을 모두 선택한 후 조회 버튼을 눌러주세요.
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import Chart from 'chart.js/auto'
import SalesFilter from '@/components/forms/salesform/SalesFilter.vue'
import MenuRankingChart from '@/components/forms/salesform/MenuRankingChart.vue'
import { useSalesStore } from '@/stores/salesStore'
import dayjs from 'dayjs'

const salesStore = useSalesStore()

// 날짜 상태
const startDate = ref('')
const endDate   = ref('')
// 차트 레퍼런스
const chartRef    = ref(null)
let chartInstance = null

// 가맹점 선택 핸들러
function onFranchiseSelect(id) {
  salesStore.filters.store = id
}

// 조회 버튼 클릭 핸들러
async function onSearch() {
  if (!salesStore.filters.store) return alert('가맹점을 먼저 선택해주세요.')
  if (!startDate.value || !endDate.value) return alert('시작/종료 날짜를 모두 선택해주세요.')

  const start = dayjs(startDate.value).format('YYYY-MM-DD')
  const end = dayjs(endDate.value).format('YYYY-MM-DD')

  await salesStore.setFilters({
    region: salesStore.filters.region,
    store: salesStore.filters.store,
    startDate: start,
    endDate: end
  })
  await salesStore.fetchMenuRanking()
}

function initChart() {
  const ctx = chartRef.value.getContext('2d')
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: salesStore.labels,
      datasets: [{ label: '매출 (원)', data: salesStore.values, backgroundColor: '#1976D2' }]
    },
    options: { responsive: true }
  })
}

// 데이터 변경 시: 차트 업데이트
watch(() => [salesStore.labels, salesStore.values], () => {
  if (!chartInstance) return initChart()
  chartInstance.data.labels = salesStore.labels
  chartInstance.data.datasets[0].data = salesStore.values
  chartInstance.update()
}, { deep: true })

// 컴포넌트 마운트 시: 빈 차트 세팅
onMounted(() => {
  initChart()
})

// 차트 데이터 유무
const hasData = computed(() => salesStore.labels.length > 0 && salesStore.values.length > 0)
</script>
