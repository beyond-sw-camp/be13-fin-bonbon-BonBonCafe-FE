<template>
    <div id="map-container">
        <div v-if="selecteStror" id="info">
          <FranchiseInfo/>
        </div>
        <div id="maps" ref="mapContainer" style="width:100%;height:725px; "></div>
    </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import apiClient from '@/api' ;
  import FranchiseInfo from '@/components/map/FranchiseInfo.vue' ;
  const {VITE_KAKAO_MAP_KEY} = import.meta.env;
  const mapContainer = ref(null)
  const selecteStror = ref(null) // 선택된 가맹점 정보

  const fetchMarkers = async () => {
    try {
      const response = await apiClient.get('/franchise/locations') // 백엔드에 맞게 조정
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
          center: new window.kakao.maps.LatLng(37.4972146715141, 126.927607128836),
          level: 12
        }

        const map = new window.kakao.maps.Map(container, options)

        const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png'
        const imageSize = new kakao.maps.Size(40, 40)
        const imageOption = { offset: new kakao.maps.Point(27, 69) }
        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

        const markerList = await fetchMarkers()

        // 클러스터러 생성
        const clusterer = new kakao.maps.MarkerClusterer({
          map: map,
          averageCenter: true,
          minLevel: 10
        })

        // markerList.forEach(store => {
        //   const markerPosition = new kakao.maps.LatLng(store.latitude, store.longitude)

        //   const marker = new kakao.maps.Marker({
        //     position: markerPosition,
        //     image: markerImage,
        //     title: store.name
        //   })

        //   marker.setMap(map)

        //   const iwContent = `<div style="padding:5px;"><span class="title">${store.name}</span></div>`

        //   const infowindow = new kakao.maps.InfoWindow({
        //     content: iwContent,
        //     removable: true
        //   })


        //   // 마커 클릭 이벤트 추가
        //   kakao.maps.event.addListener(marker, 'click', function () {
        //     infowindow.open(map, marker)
        //   })
        //   return marker
        // })
         // 마커 배열 생성

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
          // removable: true
        })

        kakao.maps.event.addListener(marker, 'click', function () {
          infowindow.open(map, marker)
          selecteStror.value = store // 가맹점 정보 저장
        })

        return marker
      })
        // 마커들을 클러스터러에 추가
        clusterer.addMarkers(markers)
      })
    }
  }

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