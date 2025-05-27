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
          <v-card class="pa-6" elevation="2" style="width: 100%; height: 530px;">
            <div class="d-flex justify-center mb-6">
              <v-avatar size="120">
                <v-img src="https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250521_095055310.png" />
              </v-avatar>
            </div>
  
            <v-row dense>
              <v-col cols="12" md="12" class="mb-3">
                <div class="info-label">가맹점주 이름</div>
                <div class="info-value">홍길동</div>
              </v-col>
              <v-col cols="12" md="12" class="mb-3">
                <div class="info-label">이메일</div>
                <div class="info-value">hong123@naver.com</div>
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
                <div class="info-value">010-1111-1111</div>
              </v-col>
              <v-col cols="12" md="6" class="mb-3">
                <div class="info-label">가맹점</div>
                <div class="info-value">메가커피 둔촌고 사거리점</div>
              </v-col>
              <v-col cols="12" md="6" class="mb-3">
                <div class="info-label">계정상태</div>
                <v-chip color="green" text-color="white" variant="elevated" size="small">활성화</v-chip>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
  
        <!-- 추가 카드 -->
        <v-col cols="12" md="6">
          <v-card class="pa-6" elevation="2" style="width: 100%; height: 530px;">
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
  import { onMounted } from 'vue';
  
  onMounted(() => {
    // KakaoMap이 로드된 후 높이를 동적으로 설정하는 코드 추가 가능
    const kakaoMapElement = document.querySelector('.kakao-map');
    const parentHeight = kakaoMapElement.parentElement.clientHeight;
  
    // 카드 높이에 맞춰서 카카오맵 높이 설정
    kakaoMapElement.style.height = `${parentHeight}px`;
    kakaoMapElement.style.width = '100%';
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
    height: 530px;
  }
  
  .kakao-map {
    height: 100% !important; /* 카드 높이에 맞춰서 크기 조정 */
    width: 100% !important;  /* 가로 폭을 카드 폭에 맞춰 조정 */
  }
  </style>
    