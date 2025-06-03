<template>
    <v-container class="pa-0">
        <v-card class="pa-0 elevation-1 " v-show="hasData">
        <v-card-text>
            <canvas ref="chartRef"></canvas>
        </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
// import { ref, onMounted, computed } from 'vue'
import { ref, watch, computed } from 'vue'
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

const props = defineProps({
  storeId: {
    type: Number,
    required: true,
  },
})

// // 페이지 진입 시 바로 매출 조회 요청
// onMounted(async () => {
//     await salesStore.setFilters({
//         region: null,
//         store: props.storeId,                                      // 테스트용 가맹점 ID
//         startDate: start.format('YYYY-MM-DD'),
//         endDate: end.format('YYYY-MM-DD')
//     })
//     initChart()
// })

watch(() => props.storeId, async (newStoreId) => {
    
    if (newStoreId) {
        await salesStore.setFilters({
            region: null,
            store: newStoreId,
            startDate: start.format('YYYY-MM-DD'),
            endDate: end.format('YYYY-MM-DD')
        })

        // 날짜 포맷 한국식으로 변경
        salesStore.labels = salesStore.labels.map(dateStr =>
            dayjs(dateStr).format('MM-DD')
        )

        updateChart()
    }
}, { immediate: true })

// 차트 업데이트 함수
function updateChart() {
    if (chartInstance) {
        chartInstance.data.labels = salesStore.labels
        chartInstance.data.datasets[0].data = salesStore.values
        chartInstance.update()
    } else {
        initChart()
    }
}

// 차트 초기화 함수
function initChart() {
    const ctx = chartRef.value.getContext('2d')
    chartInstance = new Chart(ctx, {
        // type: 'bar',
        type: 'line',
        data: {
        labels: salesStore.labels,                   // 날짜 목록
        datasets: [{
            label: '매출 (원)',                         // 데이터 레이블
            data: salesStore.values,                   // 매출 금액 데이터
            // backgroundColor: '#1976D2',                 // 바 색상
            borderColor: 'rgb(75, 192, 192)',
            fill: false,            // 하단 채우기 비활성화
            tension: 0.1            // 곡선 정도
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