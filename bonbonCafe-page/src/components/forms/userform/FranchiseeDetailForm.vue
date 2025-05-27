<template>
  <v-container class="py-4" fluid>
    <!-- 상단 타이틀 -->
    <div class="mb-4 text-subtitle-1 font-weight-medium">
      계정 관리 /
      <span class="text-primary font-weight-bold">가맹점주 관리</span>
    </div>

    <!-- 두 카드 나란히 배치 -->
    <v-row dense>
      <!-- 회원 정보 카드 -->
      <v-col cols="12" md="6">
        <v-card class="pa-6" elevation="2" style="width: 100%; height: 590px;">
          <div class="d-flex justify-center mb-6">
            <v-avatar size="120">
              <v-img :src="franchiseeInfo.userImage || 'https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/profile-default.jpg'"
              cover/>
            </v-avatar>
          </div>

          <v-row dense>
            <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">이메일</div>
              <div class="info-value">{{ franchiseeInfo.email }}</div>
            </v-col>
            <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">가맹점주 이름</div>
              <div class="info-value">{{ franchiseeInfo.name }}</div>
            </v-col>
            <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">비밀번호</div>
              <div class="d-flex align-center gap-2">
                <div class="info-value">************</div>
                <v-btn size="small" variant="outlined" color="primary">비밀번호 확인</v-btn>
              </div>
            </v-col>
            <v-col cols="12" md="6" class="mb-3">
              <div class="info-label">전화번호</div>
              <div class="info-value">{{ franchiseeInfo.phone }}</div>
            </v-col>
            <v-col cols="12" md="6" class="mb-3">
              <div class="info-label">가맹점</div>
              <!-- <div class="info-value">{{ franchiseeInfo.franchiseId }}</div> -->
              <div class="info-value">{{ franchiseeInfo.franchiseName }}</div>
            </v-col>
            <v-col cols="12" md="6" class="mb-3">
              <div class="info-label">계정상태</div>
              <v-chip :color="getStatusColor(franchiseeInfo.status)" text-color="white" variant="elevated" size="small">{{ franchiseeInfo.status }}</v-chip>
            </v-col>
            <v-col cols="12" class="d-flex justify-end mt-4">
              <v-btn color="primary" @click="goToEdit">수정하기</v-btn>
            </v-col>

          </v-row>
        </v-card>
      </v-col>

      <!-- 추가 카드 -->
      <v-col cols="12" md="6">
        <v-card class="pa-6" elevation="2" style="width: 100%; height: 590px;">
          <div class="text-subtitle-2 font-weight-bold mb-2">가맹점 위치 확인</div>
          <KakaoMap class="kakao-map" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// 추후 props 또는 store 연결 가능
import KakaoMap from '@/components/map/KakaoMap.vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';

const route = useRoute();
const router = useRouter();
const userId = route.params.userId;
const franchiseeInfo = ref({});

onMounted(() => {
  // KakaoMap이 로드된 후 높이를 동적으로 설정하는 코드 추가 가능
  const kakaoMapElement = document.querySelector('.kakao-map');
  const parentHeight = kakaoMapElement.parentElement.clientHeight;

  // 카드 높이에 맞춰서 카카오맵 높이 설정
  kakaoMapElement.style.height = `${parentHeight}px`;
  kakaoMapElement.style.width = '100%';
});

const goToEdit = () => {
  router.push(`/franchisee-accounts/${userId}/edit`);
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

onMounted(async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    console.log('userId:', userId); // userId 확인
    console.log('accessToken:', accessToken); // 토큰 확인

    const response = await apiClient.get(`/bonbon/user/franchisee/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('API 응답:', response);
    franchiseeInfo.value = response.data;
    console.log(franchiseeInfo.value);

    const kakaoMapElement = document.querySelector('.kakao-map');
    if (kakaoMapElement && kakaoMapElement.parentElement) {
      kakaoMapElement.style.height = `${kakaoMapElement.parentElement.clientHeight}px`;
      kakaoMapElement.style.width = '100%';
    }
  } catch (error) {
    console.error('가맹점주 정보 로드 실패:', error);
    if (error.response) {
      console.error('응답 데이터:', error.response.data);
      console.error('응답 상태:', error.response.status);
    } else {
      console.error('요청 실패:', error.message);
    }
  }
});


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
</style>
  