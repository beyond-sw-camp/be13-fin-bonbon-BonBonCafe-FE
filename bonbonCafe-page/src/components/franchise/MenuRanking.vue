<template>
  <div class="w-full">
    <!-- 로딩 중 -->
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="mx-auto my-6"
    />

    <!-- 오류 메시지 -->
    <v-card v-else-if="error" class="pa-2 mt-1" color="error" dark>
      {{ error }}
    </v-card>

    <!-- 랭킹 테이블 -->
    <v-table
      v-else-if="ranking.length"
      class="table-fixed w-full text-sm border-collapse"
    >
      <thead>
        <tr class="bg-gray-100">
          <th class="text-center px-4 py-2">순위</th>
          <th class="text-left px-4 py-2">메뉴</th>
          <th class="text-center px-4 py-2">수량</th>
          <th class="text-right px-4 py-2">판매액</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, idx) in ranking"
          :key="item.menuId || idx"
          class="border-b"
        >
          <td class="text-center px-4 py-2">{{ idx + 1 }}</td>
          <td class="text-left px-4 py-2">{{ item.menuName }}</td>
          <td class="text-center px-4 py-2">{{ item.totalQuantity }}</td>
          <td class="text-right px-4 py-2">
            {{ item.totalAmount.toLocaleString() }}
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- 데이터 없음 (휴점 중) -->
    <v-card v-else class="pa-4 mt-2 text-center">
      가맹점이 현재 휴점 중입니다.
    </v-card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import apiClient from '@/api'

// Props
const props = defineProps({
  franchiseId: {
    type: Number,
    required: true,
  }
})

const ranking = ref([])
const error = ref(null)
const loading = ref(false)

// 날짜 직접 지정 (예: 최근 일주일)
const startDate = '2025-05-19'
const endDate = '2025-05-24'

// fetch 함수
const fetchRanking = async (franchiseId) => {
  if (!franchiseId) return

  loading.value = true
  error.value = null

  try {
    const response = await apiClient.get(
      `/franchises/menu/ranking/${franchiseId}`,
      {
        params: {
          startDate,
          endDate,
        },
      }
    )
    console.log('가맹점 메뉴 랭킹 조회 성공', response)
    ranking.value = response.data
  } catch (err) {
    console.error('메뉴 랭킹 불러오기 실패', err)
    error.value = '메뉴 랭킹을 불러오는 중 오류가 발생했습니다.'
    ranking.value = []
  } finally {
    loading.value = false
  }
}

// franchiseId 바뀌면 조회
watch(
  () => props.franchiseId,
  (newId) => {
    if (newId) fetchRanking(newId)
  },
  { immediate: true }
)
</script>
