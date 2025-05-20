<template>
  <v-container fluid class="pa-6 sales-analysis-container">
    <sales-filter @select="onFranchiseSelect" />

    <!-- 필터 & 버튼 섹션 -->
    <v-row class="mb-6" dense>
      <v-col cols="12" sm="4">
        <v-date-input
          v-model="startDate"
          label="시작 날짜"
          variant="outlined"
          format="YYYY-MM-DD"
          model-format="YYYY-MM-DD"
          locale="ko"
          clearable
          dense
        />
      </v-col>
      <v-col cols="12" sm="4">
        <v-date-input
          v-model="endDate"
          label="종료 날짜"
          variant="outlined"
          format="YYYY-MM-DD"
          model-format="YYYY-MM-DD"
          locale="ko"
          clearable
          dense
        />
      </v-col>
      <v-col cols="12" sm="4" class="d-flex justify-end align-center">
        <v-btn color="primary" class="mr-4" @click="onSalesSearch">매출 조회</v-btn>
        <v-btn color="secondary" @click="onForecastSearch">매출 예측</v-btn>
      </v-col>
    </v-row>

    <!-- 차트 카드 섹션 -->
    <v-row dense>
      <!-- 일별 매출 -->
      <v-col cols="12" md="6" class="d-flex flex-column">
        <!-- 일별 매출 분석 -->
        <v-card class="pa-6 elevation-2 chart-card mb-6">
          <v-card-title class="subtitle-1 font-weight-bold">일별 매출 분석</v-card-title>
          <v-card-text>
            <canvas ref="salesChartRef" class="chart-canvas"></canvas>
          </v-card-text>
        </v-card>
        <!-- 주간 매출 예측 -->
        <v-card class="pa-6 elevation-2 chart-card">
          <v-card-title class="subtitle-1 font-weight-bold">주간 매출 예측</v-card-title>
          <v-card-text>
            <canvas ref="forecastChartRef" class="chart-canvas"></canvas>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 메뉴 판매 비율 -->
      <v-col cols="12" md="6">
        <v-card class="pa-6 elevation-2 chart-card">
          <v-card-title class="subtitle-1 font-weight-bold">메뉴 수량 판매 비율</v-card-title>
          <v-card-text>
            <menu-ranking-chart
              :key="salesStore.menuRanking.length"
              :ranking="salesStore.menuRanking"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 안내 문구 -->
    <v-row v-if="!hasSalesData && !hasMenuData && !hasForecastData" class="mt-12">
      <v-col cols="12" class="text-center text--secondary">
        가맹점과 날짜를 모두 선택한 후 버튼을 눌러주세요.
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch, computed, nextTick, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import dayjs from 'dayjs'
import SalesFilter      from '@/components/forms/salesform/SalesFilter.vue'
import MenuRankingChart from '@/components/forms/salesform/MenuRankingChart.vue'
import { useSalesStore } from '@/stores/salesStore'

const salesStore       = useSalesStore()
const startDate        = ref('')
const endDate          = ref('')
const salesChartRef    = ref(null)
const forecastChartRef = ref(null)

let salesChart    = null
let forecastChart = null

onMounted(() => {
  // 페이지 진입 시 이전 메뉴랭킹, 차트 데이터 모두 지우기
  salesStore.menuRanking   = []
  salesStore.labels        = []
  salesStore.values        = []
  salesStore.forecastLabels = []
  salesStore.forecastYhat   = []
  salesStore.forecastLower  = []
  salesStore.forecastUpper  = []
})

// 1) 가맹점 선택
function onFranchiseSelect(id) {
  salesStore.filters.store = id
}

// 2) 매출 + 메뉴 랭킹 조회
async function onSalesSearch() {
  if (!salesStore.filters.store)
    return alert('가맹점을 먼저 선택해주세요.')
  if (!startDate.value || !endDate.value)
    return alert('시작/종료 날짜를 모두 선택해주세요.')
  if (dayjs(startDate.value).isAfter(endDate.value))
    return alert('시작일이 종료일보다 클 수 없습니다.')

  // 두 달 초과 시 즉시 alert
  const diffMonths = dayjs(endDate.value).diff(dayjs(startDate.value), 'month', true)
  if (diffMonths > 2)
    return alert('조회 기간은 최대 두 달까지만 가능합니다.')

  salesStore.filters.startDate = dayjs(startDate.value).format('YYYY-MM-DD')
  salesStore.filters.endDate   = dayjs(endDate.value).format('YYYY-MM-DD')

  salesStore.menuRanking   = []
  salesStore.labels        = []
  salesStore.values        = []
  salesStore.forecastLabels = []
  salesStore.forecastYhat   = []
  salesStore.forecastLower  = []
  salesStore.forecastUpper  = []


  await salesStore.fetchMenuRanking()
  await salesStore.fetchSales()
}

// 3) 주간 예측 조회
async function onForecastSearch() {
  if (!salesStore.filters.store)
    return alert('가맹점을 먼저 선택해주세요.')
  if (!endDate.value)
    return alert('예측 기준 날짜(종료일)를 선택해주세요.')

  const formattedEnd = dayjs(endDate.value).format('YYYY-MM-DD')
  await salesStore.fetchWeeklyForecast({
    expectationStartDate: formattedEnd,
    periods: 7
  })
}

// 4) 차트 초기화
function initSalesChart() {
  if (!salesChartRef.value) return
  if (salesChart) salesChart.destroy()
  const ctx = salesChartRef.value.getContext('2d')
  salesChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: salesStore.labels,
      datasets: [{
        label: '매출 (원)',
        data: salesStore.values,
        backgroundColor: '#2A3663'
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  })
}
function initForecastChart() {
  if (!forecastChartRef.value) return
  if (forecastChart) forecastChart.destroy()
  const ctx = forecastChartRef.value.getContext('2d')
  forecastChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: salesStore.forecastLabels,
      datasets: [
        {
          label: '예측 매출',
          data: salesStore.forecastYhat,
          borderColor: '#FF7F11',
          backgroundColor: 'rgba(255,127,17,0.2)',
          fill: 'origin',
          tension: 0.2
        },
        {
          label: '하한',
          data: salesStore.forecastLower,
          borderColor: '#FFC857',
          borderDash: [5,5],
          fill: false
        },
        {
          label: '상한',
          data: salesStore.forecastUpper,
          borderColor: '#FFC857',
          borderDash: [5,5],
          fill: false
        }
      ]
    },
    options: { responsive: true }
  })
}

watch(
  () => salesStore.labels,
  async () => {
    if (salesStore.labels.length) {
      await nextTick()
      initSalesChart()
    }
  },
  { deep: true }
)

watch(
  () => salesStore.forecastLabels,
  async () => {
    if (salesStore.forecastLabels.length) {
      await nextTick()
      initForecastChart()
    }
  },
  { deep: true }
)


// 뷰 조건
const hasMenuData     = computed(() => salesStore.menuRanking.length > 0)
const hasSalesData    = computed(() => salesStore.values.length > 0)
const hasForecastData = computed(() => salesStore.forecastLabels.length > 0)
</script>


<style scoped>
.sales-analysis-container {
  max-width: 1280px;
  margin: 0 auto;
}

.chart-card {
  background-color: #F9F9F9;
  border-radius: 40px;

}

.chart-canvas {
  width: 100% !important;
  height: 332px !important;
}

/* date-input, select-box 여백이나 너비 조절하고 싶으면 아래를 조정하세요 */
.v-date-input {
  width: 100%;
}

</style>