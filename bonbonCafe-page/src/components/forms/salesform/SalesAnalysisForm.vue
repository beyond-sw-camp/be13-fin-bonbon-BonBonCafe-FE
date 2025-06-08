<template>
  <v-container fluid class="pa-6 sales-analysis-container">
    <!-- 페이지 타이틀 -->
    <v-row class="px-2 pt-10 pb-0 pl-2">
      <v-col cols="14">
        <v-row class="mb-7">
          <v-icon color="primary" size="40">mdi-chart-bar</v-icon>
          <div class="text-h5 font-weight-bold mt-2">
            매출 관리 / 매출 분석
          </div>
        </v-row>
        <v-divider class="my-6"></v-divider>
      </v-col>
    </v-row>

    <!-- 상단 필터 + 날짜 + 버튼 영역 -->
    <v-row class="mb-6 mt-n2" dense align="center">
      <v-col cols="12" md="6">
        <SalesFilter @select="onFranchiseSelect" />
      </v-col>
      <v-col cols="12" sm="3" md="2" class="px-0">
        <div class="date-wrapper">
          <v-date-input
            v-model="startDate"
            label="시작 날짜"
            variant="outlined"
            format="YYYY-MM-DD"
            model-format="YYYY-MM-DD"
            density="compact"
            locale="ko"
            clearable
            dense
            class="first-date"
          />
        </div>
      </v-col>
      <v-col cols="12" sm="3" md="2" class="px-0">
        <div class="date-wrapper">
          <v-date-input
            v-model="endDate"
            label="종료 날짜"
            variant="outlined"
            format="YYYY-MM-DD"
            model-format="YYYY-MM-DD"
            density="compact"
            locale="ko"
            clearable
            dense
            class="second-date"
          />
        </div>
      </v-col>
      <v-col cols="12" sm="2" md="2" class="px-0">
        <div class="button-wrapper">
          <v-btn color="primary" @click="onSearchAndForecast" rounded>
            매출 조회
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- PDF 대상 -->
    <div ref="pdfTarget">
      <v-row dense>
        <v-col cols="12" md="6" class="d-flex flex-column">
          <!-- 지난 매출 분석 카드 -->
          <v-card class="pa-6 elevation-2 chart-card mb-6">
            <v-card-title class="chart-card-title">
              지난 매출 분석
            </v-card-title>
            <v-card-subtitle class="chart-card-subtitle">
              선택한 기간의 일별 매출 흐름을 확인합니다.
              <br />
              각 날짜별 증감 추이를 통해 매출 패턴을 파악할 수 있습니다.
            </v-card-subtitle>
            <v-card-text>
              <!-- 로딩 중일 때 -->
              <div
                v-if="isLoadingSales"
                class="d-flex justify-center align-center"
                style="height: 365px;"
              >
                <v-progress-circular indeterminate color="primary" size="48" />
              </div>
              <!-- 로딩이 끝난 뒤 차트 출력 -->
              <canvas v-else ref="salesChartRef" class="chart-canvas"></canvas>
            </v-card-text>
          </v-card>

          <!-- 주간 매출 예측 카드 -->
          <v-card class="pa-6 elevation-2 chart-card">
            <v-card-title class="chart-card-title">
              주간 매출 예측
            </v-card-title>
            <v-card-subtitle class="chart-card-subtitle">
              지난 매출 데이터를 기반으로 다음 주 매출을 예측합니다.
              <br />
              예상 매출 데이터로 가맹점 운용 계획을 사전에 준비할 수 있습니다.
            </v-card-subtitle>
            <v-card-text>
              <!-- 로딩 중일 때 -->
              <div
                v-if="isLoadingForecast"
                class="d-flex justify-center align-center"
                style="height: 365px;"
              >
                <v-progress-circular indeterminate color="primary" size="48" />
              </div>
              <!-- 로딩이 끝난 뒤 차트 출력 -->
              <canvas
                v-else
                ref="forecastChartRef"
                class="chart-canvas"
              ></canvas>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 메뉴별 판매 비율 -->
        <v-col cols="12" md="6">
          <v-card class="pa-6 elevation-2 chart-card">
            <v-card-title class="chart-card-title">
              메뉴별 판매 비율
            </v-card-title>
            <v-card-subtitle class="chart-card-subtitle">
              해당 가맹점에서 판매된 메뉴별 누적 매출을 분석한 결과입니다.
              <br />
              상위 인기 메뉴들의 상대적 판매 비중을 한눈에 확인할 수 있습니다.
            </v-card-subtitle>
            <v-card-text>
              <menu-ranking-chart
                :key="salesStore.menuRanking.length"
                :ranking="salesStore.menuRanking"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-row class="mt-4" justify="end">
      <v-col cols="auto">
        <v-btn color="#D8DBBD" @click="downloadAsPdf" rounded>
          PDF 다운로드
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import dayjs from 'dayjs'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import SalesFilter from '@/components/forms/salesform/SalesFilter.vue'
import MenuRankingChart from '@/components/forms/salesform/MenuRankingChart.vue'
import { useSalesStore } from '@/stores/salesStore'
import { useRegionStore } from '@/stores/regionStore'

const regionStore = useRegionStore()
const salesStore = useSalesStore()

const startDate = ref('')
const endDate   = ref('')

const salesChartRef    = ref(null)
const forecastChartRef = ref(null)
const pdfTarget        = ref(null)

let salesChart = null
let forecastChart = null

// 로딩 플래그
const isLoadingSales    = ref(false)
const isLoadingForecast = ref(false)

onMounted(() => {
  // 마운트 시점에 스토어 초기화
  salesStore.menuRanking = []
  salesStore.labels      = []
  salesStore.values      = []
  salesStore.forecastLabels = []
  salesStore.forecastYhat   = []
  salesStore.forecastLower  = []
  salesStore.forecastUpper  = []
})

function onFranchiseSelect(id) {
  salesStore.filters.store = id
  const franchise = regionStore.franchises.find(f => f.id === id)
  salesStore.filters.storeName = franchise?.name || '가맹점'
}

async function onSearchAndForecast() {
  
  if (!salesStore.filters.store) {
    alert('가맹점을 먼저 선택해주세요.')
    return
  }
  if (!startDate.value || !endDate.value) {
    alert('시작/종료 날짜를 모두 선택해주세요.')
    return
  }
  if (dayjs(startDate.value).isAfter(endDate.value)) {
    alert('시작일이 종료일보다 클 수 없습니다.')
    return
  }
  if (dayjs(startDate.value).isAfter(Date.now()) || dayjs(endDate.value).isAfter(Date.now())) {
    alert('조회 날짜가 현재 날짜보다 클 수 없습니다.')
    return
  }
  const diffMonths = dayjs(endDate.value).diff(dayjs(startDate.value), 'month', true)
  if (diffMonths > 2) {
    alert('조회 기간은 최대 두 달까지만 가능합니다.')
    return
  }

  // --- Pinia store에 날짜 저장 ---
  salesStore.filters.startDate = dayjs(startDate.value).format('YYYY-MM-DD')
  salesStore.filters.endDate   = dayjs(endDate.value).format('YYYY-MM-DD')

  // --- 기존 데이터 초기화 ---
  salesStore.menuRanking     = []
  salesStore.labels          = []
  salesStore.values          = []
  salesStore.forecastLabels  = []
  salesStore.forecastYhat    = []
  salesStore.forecastLower   = []
  salesStore.forecastUpper   = []

  // --- 로딩 시작 (스피너 보이기) ---
  isLoadingSales.value    = true
  isLoadingForecast.value = true

  // --- 병렬 호출 ---
  await Promise.all([
    salesStore.fetchMenuRanking(),
    salesStore.fetchSales(),
    salesStore.fetchWeeklyForecast({
      expectationStartDate: dayjs(endDate.value).format('YYYY-MM-DD'),
      periods: 7
    })
  ])

  // --- 로딩 플래그 끄기: 스피너 대신 <canvas>가 렌더되도록 한다 ---
  isLoadingSales.value    = false
  isLoadingForecast.value = false

  await nextTick()

  // 지난 매출 차트
  if (salesStore.labels.length) {
    initSalesChart()
  }

  // 주간 예측 차트
  if (salesStore.forecastLabels.length) {
    initForecastChart()
  }
}

// 지난 매출 차트 그리는 함수
function initSalesChart() {
  console.log('▶ initSalesChart 호출: ', salesStore.labels, salesStore.values)
  if (!salesChartRef.value) {
    console.warn('… salesChartRef 값이 없습니다.')
    return
  }
  if (salesChart) {
    salesChart.destroy()
  }
  const ctx = salesChartRef.value.getContext('2d')
  salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: salesStore.labels,
      datasets: [
        {
          label: '매출 (원)',
          data: salesStore.values,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: val => Number(val).toLocaleString() + '원'
          }
        }
      },
      plugins: {
        legend: { display: true }
      }
    }
  })
}

// 주간 예측 차트 그리는 함수
function initForecastChart() {

  if (forecastChart) {
    forecastChart.destroy()
  }
  const ctx = forecastChartRef.value.getContext('2d')
  forecastChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: salesStore.forecastLabels,
      datasets: [
        {
          label: '예측 매출 (원)',
          data: salesStore.forecastYhat,
          borderColor: '#2A3663',          
          backgroundColor: '#3E4A8C',
          tension: 0.2
        },
        {
          label: '하한 (원)',
          data: salesStore.forecastLower,
          borderColor: '#3E4A8C',
          borderDash: [5, 5],
          fill: false
        },
        {
          label: '상한 (원)',
          data: salesStore.forecastUpper,
          borderColor: '#5A6ABF',
          borderDash: [5, 5],
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: val => Number(val).toLocaleString() + '원'
          }
        }
      },
      plugins: {
        legend: { display: true }
      }
    }
  })
}

async function downloadAsPdf() {
  if (!pdfTarget.value) return
  const canvas = await html2canvas(pdfTarget.value, { scale: 2, useCORS: true })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const imgWidth = 190
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)

  const format = date => dayjs(date).format('YYMMDD')
  const from = format(startDate.value)
  const to   = format(endDate.value)
  const name = (salesStore.filters.storeName || '가맹점').replace(/[^가-힣a-zA-Z0-9]/g, '')
  pdf.save(`${from}-${to}${name}.pdf`)
}
</script>


<style scoped>
.chart-card-title {
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 25px;
  font-weight: 700;
  color: #222222;
  justify-content: flex-start;
  padding-top: 5px;
  padding-bottom: 20px;
}

.chart-card-subtitle {
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-style: italic;
  color: rgb(26, 26, 26);
  text-align: left;
  margin-bottom: 0px;
  margin-top: 0px;
}

.sales-analysis-container {
  max-width: 1280px;
  margin: 0 auto;
}

/* 차트 카드 공통 */
.chart-card {
  background-color: #F9F9F9;
  border-radius: 40px;
}
.chart-canvas {
  width: 100% !important;
  height: 365px !important;
}

/* date-input, select-box 여백이나 너비 조절 */
.v-date-input {
  width: 100%;
}

.mt-n2 {
  margin-top: -20px !important;
}

.date-wrapper {
  min-height: 100px;
  position: relative;
}

.button-wrapper {
  min-height: 90px;
  margin-left: 80px;
}

/* 날짜 간격 조정 */
.first-date {
  margin-right: 16px;
}
.second-date {
  margin-right: 8px;
}
</style>
