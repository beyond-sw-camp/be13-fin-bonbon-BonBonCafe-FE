<template>
    <v-container fluid>
        <v-card class="pa-4 elevation-1 rounded-lg" v-show="hasData">
        <v-card-title>지난 주 매출 요약 </v-card-title>
        <v-card-text>
            <canvas ref="chartRef"></canvas>
        </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Chart from 'chart.js/auto'
import { useSalesStore } from '@/stores/salesStore'
import dayjs from 'dayjs'

// salesStore(Pinia)
const salesStore = useSalesStore()

const chartRef = ref(null)
let chartInstance = null

const today = dayjs()
const end = today.subtract(1, 'day')  // 어제 날짜
const start = end.subtract(6, 'day')  // 어제 포함 7일 전

// 페이지 진입 시 바로 매출 조회 요청
onMounted(async () => {
    await salesStore.setFilters({
        region: null,
        store: 62,                                      // 테스트용 가맹점 ID
        startDate: start.format('YYYY-MM-DD'),
        endDate: end.format('YYYY-MM-DD')
    })
    initChart()
})

// 차트 초기화 함수
function initChart() {
    const ctx = chartRef.value.getContext('2d')
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
        labels: salesStore.labels,                   // 날짜 목록
        datasets: [{
            label: '매출 (원)',                         // 데이터 레이블
            data: salesStore.values,                   // 매출 금액 데이터
            backgroundColor: '#1976D2'                 // 바 색상
        }]
        },
        options: {
        responsive: true,
        plugins: {
            legend: { display: true }
        }
        }
    })
}

// 차크에 표시할 데이터가 있는지
const hasData = computed(() =>
    salesStore.labels.length > 0 && salesStore.values.length > 0
)
</script>
