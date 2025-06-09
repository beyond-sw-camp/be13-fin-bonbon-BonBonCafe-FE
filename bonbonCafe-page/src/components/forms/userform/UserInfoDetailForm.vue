<template>
  <v-container class="d-flex justify-center align-center fill-height" fluid>
    <!-- 상단 타이틀 -->
    

    <!-- 두 카드 나란히 배치 -->
      <!-- 회원 정보 카드 -->
      <v-col cols="12" md="6" class="mt-0">
        <v-card class="pa-6 ma-0" elevation="2">
 
            <v-typography class="list"  align="center">
            개인정보 / 
            </v-typography>
            <v-typography class="title"  align="center">
            내 정보 조회
            </v-typography>
            
            <br>
            <br>

          <div class="d-flex justify-center mb-6">
            <v-avatar size="120">
              <v-img :src="userInfo.userImage || 'https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/profile-default.jpg'"
              cover/>
            </v-avatar>
          </div>

          <v-row dense>
            <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">이메일</div>
              <div class="info-value">{{ userInfo.email }}</div>
            </v-col>
            <!-- <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">비밀번호</div>
              <div class="d-flex align-center gap-2">
                <div class="info-value">************</div>
                <v-btn size="small" variant="outlined" color="primary">비밀번호 확인</v-btn>
              </div>
            </v-col> -->

            <v-col cols="12" md="6" class="mb-3">
              <div class="info-label">본사 정보</div>
              <div class="info-value">{{ userInfo.headquarterName }}</div>
            </v-col>

            <v-col cols="12" md="6" class="mb-3">
              <div class="info-label">회원 권한</div>
              <v-chip :color="getRoleColor(userInfo.role)" text-color="white" variant="elevated" size="small">{{ userInfo.role }}</v-chip>
              <!-- <div class="info-value">{{ userInfo.role }}</div> -->
            </v-col>

            <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">전화번호</div>
              <div class="info-value">{{ userInfo.phone }}</div>
            </v-col>

            <v-col cols="12" md="12" class="mb-3">
              <div class="info-label">가맹점주 이름</div>
              <div class="info-value">{{ userInfo.name }}</div>
            </v-col>

            <br>
            <v-divider></v-divider>

            
            <v-col cols="12" class="d-flex justify-center mt-4" style="gap: 10px;">
              <v-btn color="secondary" @click="goToEditPassword">비밀번호 변경</v-btn>
              <v-btn color="primary" @click="goToEdit">수정하기</v-btn>
            </v-col>

          </v-row>
        </v-card>
      </v-col>
  </v-container>
</template>

<script setup>

import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';

const userInfo = ref({});

const router = useRouter();

const goToEdit = () => {
  router.push(`/user-account-modify`);
};

const goToEditPassword = () => {
  router.push(`/password-modify`);
}


onMounted(async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    // console.log('userId:', userId); // userId 확인
    console.log('accessToken:', accessToken); // 토큰 확인

    // 본인 계정 정보 조회
    const response = await apiClient.get(`/bonbon/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('API 응답:', response);
    userInfo.value = response.data;
    console.log(userInfo.value);

  } catch (error) {
    console.error('사용자 정보 로드 실패:', error);

    if (error.response) {
      console.error('응답 데이터:', error.response.data);
      console.error('응답 상태:', error.response.status);

    } else {
      console.error('요청 실패:', error.message);
    }
  }
});


const getRoleColor = (role) => {
  switch (role) {
    case 'HEADQUARTER':
      return 'blue';
    case 'FRANCHISEE':
      return 'green';
    case 'MANAGER':
      return 'orange';
    default:
      return 'grey';
  }
};


</script>

<style lang="scss" scoped>

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