<template>
  <v-card class="ranking-card">
    <!-- ─────────── 상단 필터(Form) ─────────── -->
    <SalesRankingForm @searched="handleSearch" />

    <!-- ─────────── 테이블 + 페이징 영역 ─────────── -->
    <div class="table-wrapper">
      <v-data-table
        :headers="headers"
        :items="rankingList"
        :items-length="totalItems"
        :items-per-page="pageSize"
        :page="currentPage"                       <!-- 반드시 바인딩 -->
        hide-default-footer
        class="ranking-table rounded-b rounded-t"
        @update:page="onPageChange"
        @update:items-per-page="onPageSizeChange"
      >
        <template #item="{ item, index }">
          <tr>
            <td class="text-center">
              {{ (currentPage - 1) * pageSize + index + 1 }}
            </td>
            <td class="text-center">{{ item.franchiseName }}</td>
            <td class="text-center">{{ item.totalSales.toLocaleString() }}</td>
          </tr>
        </template>
      </v-data-table>

      <!-- 페이지네이션 -->
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        @update:model-value="onPageChange"
        class="pagination-bar"
      />

      <!-- 페이지 크기 선택 셀렉트 -->
      <v-select
        v-model="pageSize"
        :items="[5, 10, 20]"
        density="compact"
        variant="outlined"
        hide-details
        @update:model-value="onPageSizeChange"
        class="rows-per-page-select"
      />
    </div>
  </v-card>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import SalesRankingForm from '@/components/forms/salesform/SalesRankingForm.vue'
import { useRankingStore } from '@/stores/rankingStore'

const rankingStore = useRankingStore()

// ─────────── 페이징 관련 상태 ───────────
const currentPage = ref(1)
const pageSize    = ref(10)
const totalItems  = ref(0)
const totalPages  = ref(0)

// ─────────── 화면에 보여줄 데이터 ───────────
const rankingList = ref([])

// ─────────── 테이블 헤더 ───────────
const headers = [
  { title: '순위', key: 'rank', align: 'center' },
  { title: '가맹점명', key: 'franchiseName', align: 'center' },
  { title: '총 매출', key: 'totalSales', align: 'center' }
]

// ─────────── “마지막 검색 시 사용한 필터”를 저장할 객체 ───────────
// 최초에는 모두 null. 검색 버튼을 누르면 필터가 여기에 채워집니다.
const lastFilters = reactive({
  regionCode: null,
  year:       null,
  month:      null
})

/**
 * 1) SalesRankingForm.vue 에서 검색 버튼을 누르면 @searched 이벤트가 발생합니다.
 * 2) handleSearch(filters) 가 호출되면, 이 filters를 lastFilters 에 복사하고,
 *    현재 page=1, size=10 을 기본으로 해서 API를 호출합니다.
 */
function handleSearch(filters) {
  // child에서 보내준 필터값을 그대로 저장
  lastFilters.regionCode = filters.regionCode
  lastFilters.year       = filters.year
  lastFilters.month      = filters.month

  // 검색 시에는 무조건 page=1, size=10(혹은 pageSize.value)으로 초기화
  currentPage.value = 1
  pageSize.value    = 10

  fetchData(1, pageSize.value, { ...lastFilters })
}

/**
 * 2) 페이지 번호를 바꿀 때 호출
 *    최종적으로 “lastFilters + 새로운 page, size” 를 넘겨 줍니다.
 */
function onPageChange(newPage) {
  currentPage.value = newPage
  fetchData(newPage, pageSize.value, { ...lastFilters })
}

/**
 * 3) 페이지 크기를 바꿀 때 호출
 */
function onPageSizeChange(newSize) {
  pageSize.value    = newSize
  currentPage.value = 1
  fetchData(1, newSize, { ...lastFilters })
}

/**
 * 실제 API 호출 함수: page(1-based), size, 그리고 필터를 함께 넘김
 * rankingStore.fetchRanking 내부에서 백엔드로 
 *    ?regionCode=xxx&year=yyyy&month=m&page=(page-1)&size=…
 * 형태로 호출된다고 가정합니다.
 */
async function fetchData(page, size, filters) {
  try {
    await rankingStore.fetchRanking({
      regionCode: filters.regionCode,
      year:       filters.year,
      month:      filters.month,
      page:       page - 1, // 백엔드는 0부터 시작
      size:       size
    })
  } catch (err) {
    console.error('Error fetching ranking:', err)
  }
}

// ─────────── 컴포넌트 마운트될 때, 만약 초기 데이터를 불러오고 싶다면 ───────────
onMounted(() => {
  // (1) 만약 폼을 통해 무조건 검색을 해야만 테이블이 뜨도록 할 거면, 여기서 호출하지 않아도 됩니다.
  // (2) “초기 화면에 필터 없이 1페이지”를 보고 싶다면 아래처럼 호출:
  // fetchData(1, pageSize.value, { regionCode: null, year: null, month: null })
})

// ─────────── Store.rankingPage 감시 → 실제 데이터에 반영 ───────────
watch(
  () => rankingStore.rankingPage,
  (pageData) => {
    if (!pageData) return
    currentPage.value = pageData.number + 1       // 백엔드가 0-based → 화면은 1-based
    totalPages.value  = pageData.totalPages
    totalItems.value  = pageData.totalElements
    rankingList.value = pageData.content || []
  }
)
</script>

<style scoped>
.ranking-card {
  margin: 40px auto;
  padding: 40px;
  max-width: 1300px;
  background-color: #fff;
}

.table-wrapper {
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 800px; /* 필요에 따라 조절 */
}

/* 페이지네이션 */
.pagination-bar {
  margin: 16px 0;
  display: flex;
  justify-content: center;
}

/* rows-per-page 셀렉트 위치 */
.rows-per-page-select {
  position: absolute;
  bottom: 46px;
  right: 200px;
}

/* 테이블 헤더 배경색 */
::v-deep(.v-data-table__th) {
  background-color: #f2f5f8 !important;
}

/* hover 시 배경색 */
::v-deep(.v-data-table tbody tr:hover) {
  background-color: #f4faff;
  cursor: pointer;
}
</style>
