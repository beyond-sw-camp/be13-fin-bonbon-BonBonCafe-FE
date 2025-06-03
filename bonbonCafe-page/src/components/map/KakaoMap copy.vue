<template>
    <div id="map-container">
        <div v-if="selectedStore" id="info">
          <FranchiseInfo :selectedStore="selectedStore"/>
        </div>
        <div id="maps" ref="mapContainer" style="width:100%;height:725px; "></div>
    </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import apiClient from '@/api' ;
  import FranchiseInfo from '@/components/map/FranchiseInfo.vue' ;
  const {VITE_KAKAO_MAP_KEY} = import.meta.env;
  const mapContainer = ref(null);
  const selectedStore = ref(null); // 선택된 가맹점 정보
  
  
  const fetchMarkers = async () => {
    try {
      const response = await apiClient.get('/franchise/locations')
      if (!response || !response.data) {
        console.error("응답이 비어 있습니다.", response)
        return []
      }
      console.log("마커 응답:", response.data)
      return response.data
    } catch (error) {
      console.error('마커 데이터 불러오기 실패:', error)
      return []
    }
  }

  const loadMap = async (container) => {
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${VITE_KAKAO_MAP_KEY}&autoload=false&libraries=clusterer`
    document.head.appendChild(script)

    script.onload = async () => {
      window.kakao.maps.load(async () => {
        const options = {
          center: new window.kakao.maps.LatLng( 37.53847885, 127.124794),
          level: 6
        }

        const map = new window.kakao.maps.Map(container, options) // 지도 생성

        const imageSrc = 'https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/profile-default.jpg'
        const imageSize = new kakao.maps.Size(40, 40)
        const imageOption = { offset: new kakao.maps.Point(27, 69) }
        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

        
        // 클러스터러 생성
        const clusterer = new kakao.maps.MarkerClusterer({
          map: map,
          averageCenter: true,
          minLevel: 8
        })
        
      const markerList = await fetchMarkers();

      const markers = markerList.map(store => {

        const markerPosition = new kakao.maps.LatLng(store.latitude, store.longitude) 

        const marker = new kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
          title: store.name
        })

        const iwContent = `<div style="padding:5px;"><span class="title">${store.name}</span></div>`

        const infowindow = new kakao.maps.InfoWindow({
          content: iwContent,
          removable: true
        })

        kakao.maps.event.addListener(marker, 'click', async function () {
          infowindow.open(map, marker);
          // selectedStore.value = fetchFranciseInfo(store) // 가맹점 정보 저장
          // selectedStore.value = await fetchFranciseInfo(store); // 가맹점 정보 저장
          selectedStore.value = store; // 가맹점 정보 저장
          
        })

        return marker
      })
        // 마커들을 클러스터러에 추가
        clusterer.addMarkers(markers)
      })
    }
  }

  // const fetchFranciseInfo = async (store) => {
  //   try {
  //     const response = await apiClient.get(`/franchise/summary/${store.name}`)
      
  //     return response.data
  //   } catch (error) {
  //     console.error('프랜차이즈 데이터 불러오기 실패:', error)
  //   }
  // }

onMounted(() => {
  loadMap(mapContainer.value)
})
</script>

<style scoped>
#map-container{
  display: flex;
  flex-direction: row; 
  margin: none;  
}

#info{
  width: 300px;
  padding: 10px;
  flex-shrink: 0; /* 줄어들지 않도록 고정 */
  background-color: #f5f5f5;
}

#maps{
  flex: 1; /* 나머지 영역 전부 차지 */
  height: 100%;
  border: 1px solid #ccc;
}

</style>