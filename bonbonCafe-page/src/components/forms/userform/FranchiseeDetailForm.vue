<template>
  <v-container class="py-4 hei" fluid>
    <v-row dense>
      <!-- 가맹점주 정보 카드 -->
      <v-col cols="12" md="6">
        <v-card class="pa-6" elevation="2" style="width: 100%; height: 650px;">
          <v-typography class="list" align="center">계정 관리 /</v-typography>
          <v-typography class="title" align="center">가맹점주 정보 수정</v-typography>
          <br><br>

          <div class="d-flex justify-center mb-6">
            <v-avatar size="120">
              <v-img :src="franchiseeInfo.userImage || 'https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/profile-default.jpg'" cover />
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
            <v-col cols="12" md="6" class="mb-3">
              <div class="info-label">전화번호</div>
              <div class="info-value">{{ franchiseeInfo.phone }}</div>
            </v-col>
            <v-col cols="12" md="6" class="mb-3">
              <div class="info-label">가맹점</div>
              <div class="info-value">{{ franchiseeInfo.franchiseName }}</div>
            </v-col>
            <v-col cols="12" md="6" class="mb-3">
              <div class="info-label">계정상태</div>
              <v-chip :color="getStatusColor(franchiseeInfo.status)" text-color="white" variant="elevated" size="small">{{ franchiseeInfo.status }}</v-chip>
            </v-col>

            <v-divider></v-divider>

            <v-col cols="12" class="d-flex justify-center mt-4" style="gap: 10px;">
              <v-btn color="secondary" @click="goToList">목록으로</v-btn>
              <v-btn color="primary" @click="goToEdit">수정하기</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- 가맹점 위치 확인 카드 -->
      <v-col cols="12" md="6">
        <v-card class="pa-6" elevation="2" style="width: 100%; height: 650px;">
          <v-typography class="title2" align="center">가맹점 위치 확인</v-typography>
          <div id="map" ref="mapContainer" style="width: 100%; height: 95%;"></div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';

const { VITE_KAKAO_MAP_KEY } = import.meta.env;

const route = useRoute();
const router = useRouter();
const userId = route.params.userId;
const franchiseeInfo = ref({});

const goToList = () => {
  router.push({ name: 'franchisee-accounts-list' });
};

const goToEdit = () => {
  router.push(`/franchisee-accounts/${userId}/edit`);
};

const getStatusColor = (status) => {
  switch (status) {
    case 'ACTIVE': return 'green';
    case 'INACTIVE': return 'grey';
    case 'PENDING': return 'orange';
    case 'EXPIRED': return 'grey';
    case 'DELETED': return 'red';
    default: return 'blue';
  }
};

const fetchMarkers = async (keyword) => {
  try {
    const response = await apiClient.get('/franchise/locations', {
      params: { keyword },
    });
    return response.data || [];
  } catch (error) {
    console.error('마커 데이터 불러오기 실패:', error);
    return [];
  }
};

onMounted(async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await apiClient.get(`/bonbon/user/franchisee/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    franchiseeInfo.value = response.data;
    const franchiseName = franchiseeInfo.value.franchiseName;

    const locations = await fetchMarkers(franchiseName);

    if (locations.length > 0) {
      // Kakao 지도 SDK 스크립트 로드 (이미 로드되어 있으면 생략)
      await new Promise((resolve, reject) => {
        if (window.kakao && window.kakao.maps) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.onload = resolve;
        script.onerror = reject;
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${VITE_KAKAO_MAP_KEY}&autoload=false&libraries=clusterer`;
        document.head.appendChild(script);
      });

      // Kakao Maps API 초기화
      window.kakao.maps.load(() => {
        const { latitude, longitude } = locations[0];
        const mapContainer = document.getElementById('map');

        const mapOption = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3,
        };

        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
        const imageSrc  =  'https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/777fb5c7-ac23-4567-b993-9cd5d899aa38_free-icon-fast-food-4958939.png'
        const imageSize = new window.kakao.maps.Size(40, 40); // 마커 이미지 크기 (가로, 세로)
        const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);
        const marker = new window.kakao.maps.Marker({ 
          position: markerPosition,
          image: markerImage 
        });
        marker.setMap(map);
        

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;">${franchiseName}</div>`,
          position: markerPosition,
          removable: false,
        });

        infowindow.open(map, marker);
      });
    } else {
      console.warn('위치 정보 없음');
    }
  } catch (error) {
    console.error('가맹점주 정보 로드 실패:', error);
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
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

.v-card {
  height: 590px;
}

.kakao-map {
  height: 100% !important;
  width: 100% !important;
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

.hei {
  min-height: 900px;
}
</style>
