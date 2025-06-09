<template>
  <v-container fluid class="pa-4">


    <v-card class="pa-6 rounded-lg shadow-lg">

      <v-row>
      <v-col cols="12" >
          <v-typography class="list"  align="center">
          계정 관리 / 
          </v-typography>
          <v-typography class="title"  align="center">
          가맹점주 목록
          </v-typography>
        </v-col>
      </v-row>

      <!-- 🔍 검색 및 페이지 크기 -->
      <v-row align="center" no-gutters>
        <!-- 검색 필드 -->
        <v-col cols="12" md="4" class="d-flex mt-5">
          <v-text-field
            v-model="search"
            class="search-input"
            density="compact"
            variant="outlined"
            placeholder="Search by name, email..."
            prepend-inner-icon="mdi-magnify"
            clearable
            dense
            style="flex-grow: 1"
          />
        </v-col>

        <!-- <v-col cols="12" md="8" class="d-flex justify-end">
          <v-btn color="primary" @click="goToCreateFranchisee" prepend-icon="mdi-plus">
            가맹점주 신규 등록
          </v-btn>
        </v-col> -->
      </v-row>

      <!-- 데이터 테이블 -->
      <v-data-table-server
        :headers="headers"
        :items="items"
        :items-length="totalItems"
        :items-per-page="pageSize"
        :page="currentPage"
        hide-default-footer
        class="elevation-1"
        @update:options="onOptionsChange"
      >

        <template #item.franchiseName="{ item }">
          {{ item.franchiseName || '없음' }}
        </template>

        <template #item.status="{ item }">
          <!-- 계정 상태에 따라 색상과 스타일을 다르게 적용 -->
          <v-chip
            :color="getStatusColor(item.status)"
            text-color="white"
            outlined
            small
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template #item.name="{ item }">
          <!-- 각 행을 버튼처럼 만들기 위해 v-btn으로 감싸기 -->
          <v-btn
            class="d-flex justify-center align-center w-100"
            @click="goToFranchiseeDetail(item.userId)"
            outlined
            style="text-align: center; cursor: pointer;"
          >
            {{ item.name }}
          </v-btn>
        </template>

      </v-data-table-server>

      <!-- 현재 페이지 정보 및 페이지네이션 -->
      <v-row class="mt-4" align="center" justify="center">
        <v-col cols="auto" class="text-center">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="10"
            @input="onPageChange"
          />
        </v-col>
      </v-row>

      <!-- Rows per page 위치를 card 우측 하단에 고정 -->
      <v-select
        v-model="pageSize"
        :items="[5, 10, 20]"
        label="Rows per page"
        density="compact"
        variant="outlined"
        hide-details
        @update:model-value="onPageSizeChange"
        class="custom-rows-per-page"
      />
    </v-card>
  </v-container>
  <br><br><br><br><br>
</template>

<script setup>
import apiClient from '@/api';
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToFranchiseeDetail = (userId) => {
  console.log("userId:", userId);
  router.push({ name: 'franchisee-accounts', params: { userId: userId } });
};

const goToCreateFranchisee = () => {
  router.push({ name: 'franchisee-register' });
};



const search = ref('');
const items = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = ref(0);

const headers = [
  { title: '가맹점주 이름', align: 'center', key: 'name' },
  { title: '이메일', align: 'center', key: 'email' },
  { title: '전화번호', align: 'center', key: 'phone' },
  { title: '가맹점', align: 'center', key: 'franchiseName' },
  { title: '계정 상태', align: 'center', key: 'status' }
];

const fetchFranchiseeData = async (page, size) => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    const response = await apiClient.get(
      `/bonbon/user/franchisee?page=${page - 1}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    console.log(response.data.content);

    items.value = response.data.content;
    totalItems.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('가맹점주 목록 조회 실패:', error);
  }
};

const onPageChange = (page) => {
  currentPage.value = page;
  fetchFranchiseeData(page, pageSize.value);
};

const onPageSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchFranchiseeData(1, size);
};

onMounted(() => {
  fetchFranchiseeData(currentPage.value, pageSize.value);
});

watch(search, () => {
  currentPage.value = 1;
  fetchFranchiseeData(1, pageSize.value);
});

watch(currentPage, (newPage) => {
  fetchFranchiseeData(newPage, pageSize.value);
});

// 계정 상태에 맞는 색상 반환 함수
const getStatusColor = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'green';
    case 'INACTIVE':
      return 'grey';
    case 'PENDING':
      return 'orange';
    case 'EXPIRED':
      return 'grey';
    case 'DELETED':
      return 'red';
    default:
      return 'blue'; // 기본 색상
  }
};
</script>

<style scoped>
.search-input, .d-flex {
  width: 100%;
}

.v-data-table-virtual td {
  text-align: center;
}

/* Custom styling to move the Rows per page to the bottom-right of the card */
.custom-rows-per-page {
  position: absolute;
  bottom: 34px;  /* 하단에서 20px 위치 */
  left: 24px;   /* 오른쪽에서 20px 위치 */
}

.title {
  font-size: 22px;
  font-weight: 600;
  color: #3f51b5;
}

.list {
  font-size: 16px;
  font-weight: 600;
  color: gray;
}
</style>
