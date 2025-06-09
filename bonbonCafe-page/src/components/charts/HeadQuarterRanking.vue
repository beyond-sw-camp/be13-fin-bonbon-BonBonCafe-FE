<template>
  <v-card class="pa-6 elevation-2 chart-card">
    <v-card-title class="chart-card-title">
      지난 3개월 가맹점 매출 순위
    </v-card-title>
    <v-card-subtitle class="chart-card-subtitle">
      최근 3개월간 전국 가맹점의 매출 데이터를 바탕으로 집계된 순위입니다.  
      <br/>
      가맹점 간 상대적인 매출 규모를 시각적으로 비교할 수 있습니다.
    </v-card-subtitle>
    <v-card-text> 
      <div class="ranking-chart-wrapper">
        <canvas ref="chartRef"></canvas>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import dayjs from 'dayjs'
import apiClient from '@/api'
import Chart from 'chart.js/auto'

const chartRef = ref(null)
let chart = null
const rankings = ref([])

onMounted(async () => {
  const endDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  const startDate = dayjs().subtract(3, 'month').format('YYYY-MM-DD')

  try {
    const res = await apiClient.get('/franchises/all/ranking', {
      params: { startDate, endDate, limit: 10 }
    })
    rankings.value = res.data

    await nextTick()

    const canvas = chartRef.value
    const ctx = canvas.getContext('2d')
    const dpi = window.devicePixelRatio || 1

    canvas.width = canvas.clientWidth * dpi
    canvas.height = canvas.clientHeight * dpi
    ctx.scale(dpi, dpi)

    if (chart) chart.destroy()

    const labels = rankings.value.map(item => item.franchiseName)
    const data = rankings.value.map(item => item.totalSales)

    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: '매출 (원)',
          data,
          backgroundColor: function (context) {
            const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
            gradient.addColorStop(0, 'rgba(167,139,250,0.4)')  // 시작색
            gradient.addColorStop(1, 'rgba(244,114,182,0.4)')  // 끝색
            return gradient
          },
          borderColor: 'rgba(102,51,153,0.3)', // 테두리 색상 (보라 계열)
          borderWidth: 1,
          maxBarThickness: 36,
        }]

      },
      options: {
        devicePixelRatio: dpi,
        indexAxis: 'y',
        responsive: true,
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: { display: false },
          subtitle: {
              display: true,
          }
        },
        scales: {
          x: {
            ticks: {
              callback: value => Number(value).toLocaleString() + '원',
              color: '#444',
              font: {
                size: 13
              }
            },
            grid: {
              color: '#eee'
            }
          },
          y: {
            ticks: {
              color: '#333',
              font: {
                size: 14,
                weight: '600'
              }
            },
            grid: {
              display: false
            }
          }
        },
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 10,
            bottom: 10
          }
        },
        hover: {
          mode: 'nearest',
          intersect: true
        }
      }
    })
  } catch (e) {
    console.error('가맹점 순위 조회 실패', e)
  }
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
  background-color: #ffffff;
  border-radius: 40px;
  height: auto;
  display: flex;
  flex-direction: column;
}

.ranking-chart-wrapper {
  position: relative;
  width: 90%;
  height: 520px;
}

.ranking-chart-wrapper canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
