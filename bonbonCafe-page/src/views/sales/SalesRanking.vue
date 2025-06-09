<template>

  <div class = "title-wrapper">
    <v-row class="px-2 pt-10 pb-0 pl-2">
      <v-col cols="14">
        <v-row class="mb-7">
          <v-icon color="primary" size="40">mdi-chart-bar</v-icon>
          <div class="text-h5 font-weight-bold mt-2">
            매출 관리 / 매출 순위
          </div>
        </v-row>
        <v-divider class="title-divider"></v-divider>
      </v-col>
    </v-row>
  </div>


  <v-card class="ranking-card">
    <SalesRankingForm @searched="handleSearch" />

    <div class="table-wrapper">
      <v-data-table
        :headers="headers"
        :items="rankingList"
        :items-length="totalItems"
        disable-sort
        :items-per-page="pageSize"
        :page="currentPage"                    
        hide-default-footer
        class="ranking-table rounded-b rounded-t"
      >
      
        <template #item="{ item, index }">
          <tr>
            <td class="text-center">
              <v-avatar size="36">
                <v-img
                  :src="isValidImageUrl(item.franchiseImage) ? item.franchiseImage : defaultImage"
                  cover
                />
              </v-avatar>
            </td>

            <td class="text-center">
              {{ (currentPage - 1) * pageSize + index + 1 }}
            </td>
            <td class="text-center">{{ item.franchiseName }}</td>
            <td class="text-center">{{ item.roadAddress }}</td>
            <td class="text-center">{{ item.franchiseeName }}</td>
            <td class="text-center">{{ item.totalSales.toLocaleString() }}</td>
          </tr>
        </template>
      </v-data-table>

      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        class="pagination-bar"
      />

    </div>
  </v-card>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import SalesRankingForm from '@/components/forms/salesform/SalesRankingForm.vue'
import { useRankingStore } from '@/stores/rankingStore'


const rankingStore = useRankingStore()

const currentPage = ref(1)   
const pageSize    = ref(10)  // 한 페이지에 보여줄 개수

const totalItems  = ref(0)   // 전체 아이템 개수
const totalPages  = ref(0)   // 전체 페이지 개수


const rankingList = ref([])

const defaultImage =
  'https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/profile-default.jpg'

function isValidImageUrl(url) {
  return typeof url === 'string' && url.startsWith('http')
}

//  테이블 헤더 정의
const headers = [
  { title: '', align: 'start', key: 'franchiseImage', class: 'header'},
  { title: '순위', key: 'rank', align: 'center' },
  { title: '가맹점 이름', key: 'franchiseName', align: 'center' },
  { title: '가맹점 주소', align: 'start', key: 'roadAddress', class: 'header' },
  { title: '점주 이름', key: 'franchiseName', align: 'center' },
  { title: '총 매출(원)', key: 'totalSales', align: 'center' }
]

const lastFilters = reactive({
  regionCode: null,
  year:       null,
  month:      null
})

function handleSearch(filters) {

  lastFilters.regionCode = filters.regionCode
  lastFilters.year       = filters.year
  lastFilters.month      = filters.month

  currentPage.value = 1
  pageSize.value    = 10

  fetchData(1, pageSize.value, { ...lastFilters })
}

async function fetchData(page, size, filters) {
  try {
    await rankingStore.fetchRanking({
      regionCode: filters.regionCode,
      year:       filters.year,
      month:      filters.month,
      page:       page - 1,
      size:       size
    })
  } catch (err) {
    console.error('Error fetching ranking:', err)
  }
}

watch(
  () => rankingStore.rankingPage,
  (pageData) => {
    if (!pageData) return
    // 0-based → 화면용 1-based 적용
    currentPage.value = pageData.number + 1
    totalPages.value  = pageData.totalPages
    totalItems.value  = pageData.totalElements
    rankingList.value = pageData.content || []
  }
)

watch(currentPage, (newPage, oldPage) => {

  fetchData(newPage, pageSize.value, { ...lastFilters })
})

watch(pageSize, (newSize, oldSize) => {
  currentPage.value = 1
  fetchData(1, newSize, { ...lastFilters })
})
</script>

<style scoped>

.title-wrapper {
  max-width: 80%;

  /* 가로 가운데 정렬 */
  margin: 0 auto;

  /* 위/아래 여백도 필요하다면 조정 */
  padding-top: 40px;  /* 위쪽 여백 예시 */
  padding-bottom: 16px; /* 구분선 아래 여백 예시 */
}

.ranking-card {
  margin: 40px auto;
  padding: 40px;
  max-width: 1300px;
  background-color: #fff;
}

/* 테이블 래퍼 스타일 */
.table-wrapper {
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 800px;
}

/* 페이지네이션(번호) 스타일 */
.pagination-bar {
  margin: 16px 0;
  display: flex;
  justify-content: center;
}

::v-deep(.v-data-table__th) {
  background-color: #f2f5f8 !important;
}

::v-deep(.v-data-table tbody tr:hover) {
  background-color: #f4faff;
  cursor: pointer;
}
</style>
