<template>
    <v-card class="pa-6 elevation-2 chart-card">
        <v-card-title class="subtitle-1 font-weight-bold">
        전국 가맹점 예상 매출
        </v-card-title>
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
            borderColor: '#FF7F11',
            backgroundColor: 'rgba(255,127,17,0.2)',
            fill: 'origin',
            tension: 0.2,
            pointRadius: 0
            },
            {
            label: '하한선',
            data: yhatLower,
            borderColor: '#FFC857',
            borderDash: [5,5],
            fill: false,
            pointRadius: 0
            },
            {
            label: '상한선',
            data: yhatUpper,
            borderColor: '#FFC857',
            borderDash: [5,5],
            fill: false,
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
            ticks: { autoSkip: true, maxTicksLimit: 12 },
            grid: { display: false }
            },
            y: {
            beginAtZero: true
            }
        },
        plugins: {
            legend: { position: 'bottom' }
        }
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

.chart-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}
.chart-wrapper canvas {
    width: 100% !important;
    height: 100% !important;
}

.chart-container {
    padding: 0 4%;     /* 좌우 10% 씩 여백 */
    box-sizing: border-box;     /* v-card-text 영역을 꽉 채우도록 */
    position: relative;
    width: 100%;
    height: 100%;
}

</style>
