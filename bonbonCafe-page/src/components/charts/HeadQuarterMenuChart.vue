<template>
  <v-card class="pa-6 elevation-2 chart-card ">
    <v-card-title class="chart-card-title">
      지난 3개월 메뉴별 판매 비율
    </v-card-title>
    <v-card-subtitle class="chart-card-subtitle">
      본사 집계 기준으로 전국 가맹점에서 판매된 메뉴별 누적 매출을 분석한 결과입니다.  
      <br/>
      상위 인기 메뉴들의 상대적 판매 비중을 한눈에 확인할 수 있습니다.
    </v-card-subtitle>

    <v-card-text class="d-flex flex-row justify-space-between align-center">
        <!-- 차트 영역 -->
        <div class="chart-wrapper mr-4" style="flex: 1;">
            <canvas ref="chartRef"></canvas>
        </div>

        <!-- 테이블 영역 -->
        <v-simple-table dense class="my-menu-table mt-10 pl-7" style="flex: 1;">
            <thead>
                <tr>
                    <th class="text-center font-weight-bold">메뉴</th>
                    <th class="text-center font-weight-bold">매출 (원)</th>
                    <th class="text-center font-weight-bold">비율 (%)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, idx) in ranking" :key="idx" class="table-row">
                    <td class="text-center d-flex align-center justify-center" style="gap: 8px;">
                        <v-chip
                            :style="{ backgroundColor: chartColors[idx], width: '12px', height: '12px' }"
                            class="ma-0 pa-0"
                            rounded
                        />
                        {{ item.menuName }}</td>
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

// 색상 정의
const chartColors = [
    'rgba(255, 99, 132, 0.6)',    // 부드러운 살구색
    'rgba(255, 159, 64, 0.6)',    // 부드러운 주황
    'rgba(255, 205, 86, 0.6)',    // 레몬옐로우
    'rgba(75, 192, 192, 0.6)',    // 민트 그린
    'rgba(54, 162, 235, 0.6)',    // 하늘색
    'rgba(153, 102, 255, 0.6)',   // 라벤더 퍼플
    'rgba(201, 203, 207, 0.6)'    // 연회색
]


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
    
    if (chart) chart.destroy()

    const ctx = chartRef.value.getContext('2d')
        chart = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: chartColors,
                    borderWidth: 1,
                    // radius: '90%',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        display: false,
                    },
                },
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
    background-color: #ffff;
    border-radius: 40px;
    height: 700px;
}
/* canvas 영역을 고정 높이로 */
.chart-wrapper {
    position: relative;
    width: 100%;
    height: 520px;
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
    font-size: 13px;
    padding: 12px 16px;
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

::v-deep(.v-chip) {
  border-radius: 50% !important;
  min-width: 12px !important;
  height: 12px !important;
}
</style>