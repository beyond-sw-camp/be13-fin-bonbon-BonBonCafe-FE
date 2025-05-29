<template>
    <v-card class="pa-6 elevation-2 chart-card">
        <v-card-title class="subtitle-1 font-weight-bold">
        지난 메뉴 판매 비율
        </v-card-title>
        <v-card-text>
        <div class="chart-wrapper">
            <canvas ref="chartRef"></canvas>
        </div>
        <v-simple-table dense class="my-menu-table">

        <tbody>
        <tr v-for="(item, idx) in ranking" :key="idx">
            <td class="text-center ">{{ item.menuName }}</td>
            <td class="text-center">{{ item.totalAmount.toLocaleString() }}</td>
            <td class="text-center">{{ percentages[idx] }}%</td>
        </tr>
        </tbody>
    </v-simple-table>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import dayjs from 'dayjs'
import apiClient from '@/api'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns'

// 차트용 캔버스 레퍼런스
const chartRef = ref(null)
let chart = null

// 서버에서 받아온 데이터
const ranking = ref([])

// 총합 계산
const totalSales = computed(() =>
    ranking.value.reduce((sum, r) => sum + r.totalAmount, 0)
)   

// 각 항목의 비율
const percentages = computed(() =>
    ranking.value.map(r =>
        ((r.totalAmount / totalSales.value) * 100).toFixed(1)
    )
)

onMounted(async () => {
    // 지난 3개월 기간 계산
    const endDate   = dayjs().format('YYYY-MM-DD')
    const startDate = dayjs().subtract(3, 'month').format('YYYY-MM-DD')

    // 백엔드에서 전체 메뉴 랭킹 조회
    const res = await apiClient.get('/franchises/all/menu/ranking', {
        params: { startDate, endDate }
    })
    ranking.value = res.data

    if (!ranking.value.length) return

    // 차트 데이터
    const labels = ranking.value.map(i => i.menuName)
    const values = ranking.value.map(i => i.totalAmount)

    await nextTick()
    const ctx = chartRef.value.getContext('2d')
    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
        labels,
        datasets: [{
            data: values,
            backgroundColor: [
                '#F98084', //
                '#F7CAC9', // 파스텔 핑크
                '#92A8D1', // 파스텔 블루
                '#BFD7B5', // 파스텔 민트
                '#F6E2B3', // 파스텔 옐로우
                '#FFE5D9', // 파스텔 피치
                '#D3C0EB'  // 파스텔 라벤더
            ],
            borderWidth: 1,
            radius: '90%',
        }]
        },
        options: {
        responsive: true,
        cutout: '60%',
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        }
        }
    })
})
</script>

<style scoped>
.chart-card {
    background-color: #F9F9F9;
    border-radius: 40px;
}
/* canvas 영역을 고정 높이로 */
.chart-wrapper {
    position: relative;
    width: 100%;
    height: 390px;
}
.chart-wrapper canvas {
    width: 100% !important;
    height: 100% !important;
}

.my-menu-table td,
.my-menu-table th {
  white-space: nowrap;       /* 줄바꿈 금지 */
  overflow: hidden;          /* 넘치는 텍스트 자르기 */
  text-overflow: ellipsis;   /* 잘린 부분 “…” 표시 */
}


::v-deep(.my-menu-table) {
    display: block;     
    width: fit-content;   
    margin: 1%;       
}

/* 모든 셀에 padding, 폰트 스타일 지정 */
::v-deep(.my-menu-table) td {
    padding: 12px 33px !important;
    font-size: 12px !important;
    line-height: 0.2 !important;
    font-weight: 500 !important;
}

::v-deep(.my-menu-table) tbody tr td:nth-child(1) {
  font-weight: 800 !important; /* 1열 (메뉴명) */
}
::v-deep(.my-menu-table) tbody tr td:nth-child(2) {
  font-weight: 200 !important; /* 2열 (총 매출) */
}
::v-deep(.my-menu-tabl) tbody tr td:nth-child(3) {
  font-weight: 800 !important; /* 3열 (비율) */
}
</style>