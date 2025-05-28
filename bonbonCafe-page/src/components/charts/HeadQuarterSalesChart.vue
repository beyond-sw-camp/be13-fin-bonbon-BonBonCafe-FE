<!-- src/components/charts/HeadQuarterSalesChart.vue -->
<template>
  <v-card class="chart-card fill-height pa-3 elevation-2">
    <v-card-title class="chart-title ">
      지난 매출 추이
    </v-card-title>
    <v-card-text class="fixed-chart-height"> 
      <div class = "chart-container">
        <canvas ref="chartRef"></canvas>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import 'chartjs-adapter-date-fns'
import { ref, onMounted, nextTick } from 'vue'
import dayjs from 'dayjs'
import apiClient from '@/api'
import Chart from 'chart.js/auto'

const chartRef = ref(null)
let chart = null

onMounted(async () => {
  const endDate   = dayjs().format('YYYY-MM-DD')
  const startDate = dayjs().subtract(3, 'month').format('YYYY-MM-DD')
  const startDateLY = dayjs().subtract(15, 'month').format('YYYY-MM-DD')
  const endDateLY   = dayjs().subtract(12, 'month').format('YYYY-MM-DD')

  // 올해 데이터
  const { data }     = await apiClient.get('/franchises/all/sales/period', { params: { startDate, endDate } })
  // 작년 데이터
  const { data: dataLast } = await apiClient.get('/franchises/all/sales/period', { params: { startDate: startDateLY, endDate: endDateLY } })

  const points     = data.map(d => ({ x: d.salesDate, y: d.totalAmount }))
  const pointsLast = dataLast.map(d => ({
    x: dayjs(d.salesDate).add(12, 'month').format('YYYY-MM-DD'),
    y: d.totalAmount
  }))

  await nextTick()
  const ctx = chartRef.value.getContext('2d')
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: '올해 매출 (원)',
          data: points,
          borderColor: '#F98084',
          backgroundColor: 'rgba(249,128,132,0.2)',
          fill: true,
          borderWidth: 1,
          pointRadius: ctx => {
            const ticks = ctx.chart.scales.x.ticks.map(t => t.value)
            return ticks.includes(ctx.parsed.x) ? 2 : 0
          }
        },
        {
          label: '작년 매출 (원)',
          data: pointsLast,
          borderColor: '#E35A7A',
          backgroundColor: 'rgba(227,90,122,0.2)',
          fill: true,
          borderWidth: 1,
          pointRadius: ctx => {
            const ticks = ctx.chart.scales.x.ticks.map(t => t.value)
            return ticks.includes(ctx.parsed.x) ? 2 : 0
          }
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'week',
            tooltipFormat: 'yyyy-MM-dd',
            displayFormats: { week: 'MM-dd' }
          },
          ticks: { autoSkip: false, stepSize: 1 },
          grid: { display: false }
        },
        y: { beginAtZero: true }
      },
      plugins: { legend: { display: true, position: 'bottom' } }
    }
  })
})
</script>

<style scoped>


.chart-card {
  display: flex;
  flex-direction: column;
  border-radius: 40px;
  background-color: #F9F9F9;
  }
  /* 타이틀만 살짝 아래 패딩 */
.chart-title {
  padding: 16px;
  font-weight: bold;

}

.chart-container {
  padding: 0 4%;     /* 좌우 10% 씩 여백 */
  box-sizing: border-box;     /* v-card-text 영역을 꽉 채우도록 */
  position: relative;
  width: 100%;
  height: 100%;
}

</style>
