<template>
  <v-container fluid class="pa-6 sales-analysis-container">
    <sales-filter @select="onFranchiseSelect" />

    <v-row class="mb-6" dense>
      <v-col cols="12" sm="4">
        <v-date-input v-model="startDate" label="시작 날짜" variant="outlined" format="YYYY-MM-DD" model-format="YYYY-MM-DD"
          locale="ko" clearable dense />
      </v-col>
      <v-col cols="12" sm="4">
        <v-date-input v-model="endDate" label="종료 날짜" variant="outlined" format="YYYY-MM-DD" model-format="YYYY-MM-DD"
          locale="ko" clearable dense />
      </v-col>
      <v-col cols="12" sm="4" class="d-flex justify-end align-center">
        <v-btn color="primary" class="mr-4" @click="onSalesSearch">매출 조회</v-btn>
        <v-btn color="secondary" class="mr-4" @click="onForecastSearch">매출 예측</v-btn>
        <v-btn color="success" v-if="showPdfButton" @click="downloadAsPdf">PDF 다운로드</v-btn>
      </v-col>
    </v-row>

    <!-- PDF 대상 -->
    <div ref="pdfTarget">
      <v-row dense>
        <v-col cols="12" md="6" class="d-flex flex-column">
          <v-card class="pa-6 elevation-2 chart-card mb-6">
            <v-card-title class="subtitle-1 font-weight-bold">일별 매출 분석</v-card-title>
            <v-card-text>
              <canvas ref="salesChartRef" class="chart-canvas"></canvas>
            </v-card-text>
          </v-card>
          <v-card class="pa-6 elevation-2 chart-card">
            <v-card-title class="subtitle-1 font-weight-bold">주간 매출 예측</v-card-title>
            <v-card-text>
              <canvas ref="forecastChartRef" class="chart-canvas"></canvas>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="pa-6 elevation-2 chart-card">
            <v-card-title class="subtitle-1 font-weight-bold">메뉴 수량 판매 비율</v-card-title>
            <v-card-text>
              <menu-ranking-chart :key="salesStore.menuRanking.length" :ranking="salesStore.menuRanking" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { ref, watch, computed, nextTick, onMounted } from 'vue'
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
const endDate = ref('')
const showPdfButton = ref(false)

const salesChartRef = ref(null)
const forecastChartRef = ref(null)
const pdfTarget = ref(null)

let salesChart = null
let forecastChart = null

onMounted(() => {
  salesStore.menuRanking = []
  salesStore.labels = []
  salesStore.values = []
  salesStore.forecastLabels = []
  salesStore.forecastYhat = []
  salesStore.forecastLower = []
  salesStore.forecastUpper = []
})

function onFranchiseSelect(id) {
  salesStore.filters.store = id
  const franchise = regionStore.franchises.find(f => f.id === id)
  salesStore.filters.storeName = franchise?.name || '가맹점'
}

async function onSalesSearch() {
  if (!salesStore.filters.store) return alert('가맹점을 먼저 선택해주세요.')
  if (!startDate.value || !endDate.value) return alert('시작/종료 날짜를 모두 선택해주세요.')
  if (dayjs(startDate.value).isAfter(endDate.value)) return alert('시작일이 종료일보다 클 수 없습니다.')
  if (dayjs(startDate.value).isAfter(Date.now()) || dayjs(endDate.value).isAfter(Date.now())) return alert('조회 날짜가 현재 날짜보다 클 수 없습니다.')
  const diffMonths = dayjs(endDate.value).diff(dayjs(startDate.value), 'month', true)
  if (diffMonths > 2) return alert('조회 기간은 최대 두 달까지만 가능합니다.')

  salesStore.filters.startDate = dayjs(startDate.value).format('YYYY-MM-DD')
  salesStore.filters.endDate = dayjs(endDate.value).format('YYYY-MM-DD')

  salesStore.menuRanking = []
  salesStore.labels = []
  salesStore.values = []
  salesStore.forecastLabels = []
  salesStore.forecastYhat = []
  salesStore.forecastLower = []
  salesStore.forecastUpper = []

  await salesStore.fetchMenuRanking()
  await salesStore.fetchSales()

  showPdfButton.value = true
}

async function onForecastSearch() {
  if (!salesStore.filters.store) return alert('가맹점을 먼저 선택해주세요.')
  if (!endDate.value) return alert('예측 기준 날짜(종료일)를 선택해주세요.')

  const formattedEnd = dayjs(endDate.value).format('YYYY-MM-DD')
  await salesStore.fetchWeeklyForecast({ expectationStartDate: formattedEnd, periods: 7 })
}

function initSalesChart() {
  if (!salesChartRef.value) return
  if (salesChart) salesChart.destroy()
  const ctx = salesChartRef.value.getContext('2d')
  salesChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: salesStore.labels,
      datasets: [{ label: '매출 (원)', data: salesStore.values, backgroundColor: '#7465DA' }]
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
        { label: '예측 매출', data: salesStore.forecastYhat, borderColor: '#FF7F11', backgroundColor: 'rgba(255,127,17,0.2)', fill: 'origin', tension: 0.2 },
        { label: '하한', data: salesStore.forecastLower, borderColor: '#FFC857', borderDash: [5, 5], fill: false },
        { label: '상한', data: salesStore.forecastUpper, borderColor: '#FFC857', borderDash: [5, 5], fill: false }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 } },
        y: { beginAtZero: true }
      },
      plugins: { legend: { display: true } }
    }
  })
}

async function downloadAsPdf() {
  const el = pdfTarget.value
  if (!el) return
  const canvas = await html2canvas(el, { scale: 2, useCORS: true })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const imgWidth = 190
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)

  // 파일명 조립
  const format = (date) => dayjs(date).format('YYMMDD')
  const from = format(startDate.value)
  const to = format(endDate.value)
  const name = (salesStore.filters.storeName || '가맹점').replace(/[^가-힣a-zA-Z0-9]/g, '')
  pdf.save(`${from}-${to}${name}.pdf`)
}

watch(() => salesStore.labels, async () => {
  if (salesStore.labels.length) await nextTick().then(initSalesChart)
}, { deep: true })

watch(() => salesStore.forecastLabels, async (labels) => {
  if (labels.length) await nextTick().then(initForecastChart)
}, { deep: true })
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
  height: 365px !important;
}

.v-date-input {
  width: 100%;
}
</style>