<template>
    <v-card class="pa-6 elevation-2 chart-card">
        <v-card-title class="chart-card-title">
            전국 가맹점 매출 예측 현황 
            </v-card-title>
            <v-card-subtitle class="chart-card-subtitle">
            매출 데이터를 기반으로 인공지능(AI)이 분석한 전국 가맹점의 향후 90일 매출 예측입니다.
            <br/>
            명확한 상·하한 범위를 통해 매출 변동성을 미리 확인할 수 있습니다.
        </v-card-subtitle>
        <v-card-text class="fixed-chart-height pt-10">
            <div class="chart-wrapper">
                <canvas ref="canvasRef"></canvas>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import dayjs from 'dayjs'
import apiClient from '@/api'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns'

// 1) 캔버스 레퍼런스 & 차트 인스턴스
const canvasRef = ref(null)
let chart = null

onMounted(async () => {

    const today = dayjs().format('YYYY-MM-DD')
    const periods = 90


    const { data: forecast } = await apiClient.get(
        '/franchises/all/forecast',
        { params: { expectationStartDate: today, periods } }
    )

    if (!forecast.length) return

    // Chart.js용 데이터 포맷 변환
    const labels = forecast.map(f => f.ds)
    const yhat       = forecast.map(f => f.yhat)
    const yhatLower  = forecast.map(f => f.yhat_lower)
    const yhatUpper  = forecast.map(f => f.yhat_upper)

    await nextTick()
    const ctx = canvasRef.value.getContext('2d')

    // 차트 초기화
    chart = new Chart(ctx, {
        type: 'line',
        data: {
        labels,
        datasets: [
            {
            label: '예측 매출',
            data: yhat,
            borderColor: 'rgba(11, 92, 199, 0.8)',          
            backgroundColor: '#3E4A8C',
            tension: 0.2,
            pointRadius: 0
            },
            {
            label: '',               
            data: yhatLower,
            borderColor: 'transparent',
            backgroundColor: 'rgba(195, 221, 255, 0.8)',
            fill: '+1',
            pointRadius: 0
            },
            {
            label: '',             
            data: yhatUpper, 
            borderColor: 'transparent',
            backgroundColor: 'rgba(195, 221, 255, 0.8)',
            fill: '+1',
            pointRadius: 0
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
                parser: 'yyyy-MM-dd',
                unit: 'week',
                displayFormats: { week: 'MM-dd' }
            },
            title: {
                display: true,
                text: '날짜',
                font: {size: 14, weight: '600'},
                color: '#444',
            },
            ticks: { autoSkip: true, maxTicksLimit: 12 },
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
        plugins: {
            legend: { 
                position: 'bottom',
                labels: {
                    filter: (legendItem, chart) => {
                        return legendItem.text === '예측 매출';
                    }
                } 
            }
        }
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
