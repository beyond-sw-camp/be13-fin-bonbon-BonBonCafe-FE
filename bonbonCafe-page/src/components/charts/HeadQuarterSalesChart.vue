<!-- src/components/charts/HeadQuarterSalesChart.vue -->
<template>
  <v-card class="pa-6 elevation-2 chart-card">
    <v-card-title class="chart-card-title">
      지난 3개월 매출 현황
    </v-card-title>
    <v-card-subtitle class="chart-card-subtitle">
      최근 3개월간 전국 가맹점의 일별 매출 데이터를 한눈에 살펴보고
      <br/>
      매출의 흐름과 변화를 빠르게 파악할 수 있도록 제공합니다.
    </v-card-subtitle>
    <v-card-text class="fixed-chart-height pt-10"> 
      <div class = "chart-wrapper">
        <canvas ref="chartRef"></canvas>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useSalesStore } from '@/stores/salesStore'

import 'chartjs-adapter-date-fns'
import { ref, onMounted, nextTick } from 'vue'
import dayjs from 'dayjs'
import apiClient from '@/api'
import Chart from 'chart.js/auto'

const salesStore = useSalesStore()
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
          label: '올해 매출',
          data: points,
          borderColor: 'rgb(75, 192, 192)',
          fill: false,
          pointRadius: (context) => {
            const ticks = context.chart.scales.x.ticks.map(t => dayjs(t.value).format('YYYY-MM-DD'))
            const currentX = dayjs(context.parsed.x).format('YYYY-MM-DD')
            return ticks.includes(currentX) ? 3 : 0  
          },
          pointBackgroundColor: 'rgb(75, 192, 192)',
          pointHoverRadius: 2
        },
        // {
        //   label: '작년 매출 (원)',
        //   data: pointsLast,
        //   borderColor: '#E35A7A',
        //   backgroundColor: 'rgba(227,90,122,0.2)',
        //   fill: true,
        //   borderWidth: 1,
        //   pointRadius: ctx => {
        //     const ticks = ctx.chart.scales.x.ticks.map(t => t.value)
        //     return ticks.includes(ctx.parsed.x) ? 2 : 0
        //   }
        // }
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
          title: {
            display: true,
            text: '날짜',
            font: {size: 14, weight: '600'},
            color: '#444',
          },
          ticks: { autoSkip: false, stepSize: 1 },
          grid: { display: false }
        },
        y: { 
          beginAtZero: true,
          title: {
            display: true,
            text: '만(원)',
            font: {size: 14, weight: '600'},
            color: '#444',
          },
          ticks: {
              callback: value => {
                if (value === 0) {
                  return '0';
                }
                return (value / 10_000).toFixed(0);
              },
                
              color: '#444',
              font: {
                size: 13
              }
            },
        }
      },
      plugins: { legend: { display: true, position: 'bottom' } }
    }
  })
})
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

.chart-card {
  display: flex;
  flex-direction: column;
  border-radius: 40px;
  background-color: #F9F9F9;
  }

.chart-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}
.chart-wrapper canvas {
    width: 100% !important;
    height: 100% !important;
}

</style>
