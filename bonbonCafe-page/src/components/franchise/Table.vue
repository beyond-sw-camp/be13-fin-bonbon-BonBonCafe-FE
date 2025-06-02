<template>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="header"
    :items="item"
    class="rounded-b rounded-t"
    @click="goToDetail"
    >
    <!-- @update:options="onOptionsUpdate" -->

    <template #item.status="{ item }">
      <v-chip variant="tonal" :color="getStatusColor(item.status)">
        {{ getStatusText(item.status) }}
      </v-chip>
    </template>


     <template #body="{ items }">
      <tbody>
        <tr
          v-for="item in items"
          :key="item.franchiseId"
          @click="goToDetail(item)"
          style="cursor: pointer;"
        >
          <!-- <td v-for="header in header" :key="header.value"> -->
            <!-- 각 칼럼 값 출력 -->
            <!-- {{ item[header.value] }}
          </td> -->
        </tr>
      </tbody>
    </template>
    
    <!-- <template #item.franchiseImage="{ item }">
      <v-avatar size="32">
        <v-img :src="item.franchiseImage"></v-img>
    </v-avatar>
    </template> -->

    <!-- <template #item.name="{ item }">
      <span @click="goToDetail(item)" style="cursor: pointer; color: blue;">
        {{ item.name }}
      </span>
    </template> -->
    
  </v-data-table-server>
</template>


<script setup>
    import { useRouter } from 'vue-router'

    const props = defineProps({
        item:{
            type: Array,
            required: true
        },
        header:{
            type: Array,
            required: true
        }
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPERATING':
                return 'green';
            case 'CLOSED_TEMP':
                return 'primary';
            case 'CLOSED_PERM':
                return 'error';
            default:
                return 'grey';
        }
    };

    // 한글 상태명 매핑 함수
    const getStatusText = (status) => {
        switch (status) {
            case 'OPERATING':
            return '운영중'
            case 'CLOSED_TEMP':
            return '임시 휴업'
            case 'CLOSED_PERM':
            return '폐점'
            default:
            return '알 수 없음'
        }
    }

    const router = useRouter()

    const goToDetail = (item) => {
      
      router.push(`/franchise/${item.franchiseId}`);
    };

</script>

<style scoped>

.v-data-table-server tbody tr:hover {
  background-color: #f0f8ff; /* 연한 파란색 예시 */
  cursor: pointer; /* 마우스 커서 포인터로 변경 */
}
 
::v-deep(.v-data-table__thead) {
  background-color: #f2f5f8 !important;
}


</style>