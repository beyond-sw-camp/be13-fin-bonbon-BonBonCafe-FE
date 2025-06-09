<template>
  <v-container class="py-4" fluid>
    <!-- 상단 타이틀 -->
    

    <!-- 두 카드 나란히 배치 -->
    <v-row dense>
      <!-- 회원 정보 카드 -->
      <v-col cols="12" md="6">
        <v-card class="pa-6" elevation="2" style="width: 100%; height: 650px;">
 
            <v-typography class="list"  align="center">
            계정 관리 / 
            </v-typography>
            <v-typography class="title"  align="center">
            지역구 담당자 정보 수정
            </v-typography>
            
            <br>
            <br>

          <div class="d-flex justify-center mb-6">
            <v-avatar size="120">
              <v-img :src="managerInfo.userImage || 'https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/profile-default.jpg'"
              cover/>
            </v-avatar>
          </div>

          <v-row dense>
            <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">이메일</div>
              <div class="info-value">{{ managerInfo.email }}</div>
            </v-col>
            <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">가맹점주 이름</div>
              <div class="info-value">{{ managerInfo.name }}</div>
            </v-col>
            <!-- <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">비밀번호</div>
              <div class="d-flex align-center gap-2">
                <div class="info-value">************</div>
                <v-btn size="small" variant="outlined" color="primary">비밀번호 확인</v-btn>
              </div>
            </v-col> -->
            <v-col cols="12" md="6" class="mb-3">
              <div class="info-label">전화번호</div>
              <div class="info-value">{{ managerInfo.phone }}</div>
            </v-col>
            <v-col cols="12" md="6" class="mb-3">
              <div class="info-label">담당 지역</div>
              <div class="info-value">{{ managerInfo.region }}</div>
            </v-col>
            <v-col cols="12" md="6" class="mb-3">
              <div class="info-label">계정상태</div>
              <v-chip :color="getStatusColor(managerInfo.status)" text-color="white" variant="elevated" size="small">{{ managerInfo.status }}</v-chip>
            </v-col>

            <br>
            <v-divider></v-divider>

            <v-col cols="12" class="d-flex justify-center mt-4" style="gap: 10px;">
              <v-btn color="secondary" @click="goToList">목록으로</v-btn>
              <v-btn color="primary" @click="goToEdit">수정하기</v-btn>
            </v-col>

          </v-row>
        </v-card>
      </v-col>

      <!-- 추가 카드 -->
      <v-col cols="12" md="6">
        <v-card class="pa-6" elevation="2" style="width: 100%; height: 650px;">
          <div>
            <v-typography class="title2"  align="center">
              {{ managerInfo.region }} 가맹점 목록
            </v-typography>
          </div>
          <v-card-text>
            <!-- 검색창 -->
            <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                placeholder="가맹점명으로 검색"
                clearable
                density="compact"
                variant="outlined"
            />

            <!-- 목록 -->
            <v-data-table-server
                :headers="headers"
                :items="items"
                :items-length="totalItems"
                :items-per-page="pageSize"
                :page="currentPage"
                @click:row="(event, item) => selectFranchise(item)"
                @update:options="onOptionsChange"
                class="elevation-1"
                hide-default-footer
            >

            <template #no-data>
              <div class="text-center py-6">
                해당 지역구에 가맹점 데이터가 없습니다.
              </div>
            </template>
            </v-data-table-server>
            <!-- 페이지네이션 -->
            <v-row class="mt-4" align="center" justify="center">
                <v-col cols="auto" class="text-center">
                <v-pagination
                    v-model="currentPage"
                    :length="totalPages"
                    :total-visible="3"
                    @input="onPageChange"
                />
                </v-col>
            </v-row>
            </v-card-text>
 
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// 추후 props 또는 store 연결 가능
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';

const route = useRoute();
const router = useRouter();
const userId = route.params.userId;
const managerInfo = ref({});

const goToList = () => {
  router.push({name : 'manager-accounts-list'}); // 원하는 목록 페이지 경로로 변경
};


const goToEdit = () => {
  router.push(`/manager-accounts/${userId}/edit`);
};

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
      return 'blue';
  }
};

const headers = ref([
    { title: '가맹점명', key: 'name', align: 'center' },
    { title: '전화번호', key: 'franchiseTel', align: 'center' },
    { title: '도로명주소', key: 'roadAddress', align: 'center' }
  ]);

  
  const visible = ref(false);
  const items = ref([]);
  const search = ref('');
  const currentPage = ref(1);
  const pageSize = ref(7);
  const totalItems = ref(0);
  const totalPages = ref(0);

onMounted(async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    console.log('userId:', userId); // userId 확인
    console.log('accessToken:', accessToken); // 토큰 확인

    const response = await apiClient.get(`/bonbon/user/manager/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('API 응답:', response);
    managerInfo.value = response.data;
    console.log(managerInfo.value);

  } catch (error) {
    console.error('가맹점주 정보 로드 실패:', error);
    if (error.response) {
      console.error('응답 데이터:', error.response.data);
      console.error('응답 상태:', error.response.status);
    } else {
      console.error('요청 실패:', error.message);
    }
  }

  fetchFranchiseList(currentPage.value, pageSize.value, search.value);
});


const fetchFranchiseList = async (page, size, search = '') => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await apiClient.get('/bonbon/user/manager/franchises', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: {
          regionCode: managerInfo.value.regionCode,
          page: page - 1,
          size,
          keyword: search
        }
      });

      console.log(res);
  
      items.value = res.data.content;
      totalItems.value = res.data.totalElements;
      totalPages.value = res.data.totalPages;
      console.log(items);
    } catch (error) {
      console.error('가맹점 목록 조회 실패:', error);
    }
  };

  watch(visible, async (visible) => {
    if (visible) {
      await nextTick();
      fetchFranchiseList(currentPage.value, pageSize.value, search.value);
    }
  });
  
  watch(search, () => {
    currentPage.value = 1;
    fetchFranchiseList(1, pageSize.value, search.value);
  });
  
  const onPageChange = (page) => {
    currentPage.value = page;
    fetchFranchiseList(page, pageSize.value, search.value);
  };

  const onOptionsChange = (options) => {
    currentPage.value = options.page;
    pageSize.value = options.itemsPerPage;
    fetchFranchiseList(options.page, options.itemsPerPage, search.value);
  };

</script>

<style scoped>
.info-label {
  font-size: 14px;
  color: #888;
  margin-bottom: 4px;
}

.info-value {
  font-size: 16px;
  font-weight: 500;
  color: #222;
}

.gap-2 {
  gap: 8px;
}

/* 카드 내에서 KakaoMap의 높이 및 크기 조정 */
.v-card {
  height: 590px;
}

.kakao-map {
  height: 100% !important; /* 카드 높이에 맞춰서 크기 조정 */
  width: 100% !important;  /* 가로 폭을 카드 폭에 맞춰 조정 */
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #3f51b5;
}

.title2 {
  font-size: 16px;
  font-weight: 500;
  color: black;
}

.list {
  font-size: 16px;
  font-weight: 600;
  color: gray;
}
</style>
  