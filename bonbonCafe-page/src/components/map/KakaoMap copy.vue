<template>
    <div id="map-container">
        <div v-if="selectedStore" id="info">
          <FranchiseInfo :selectedStore="selectedStore"@focus-marker="handleFocusMarker"/>
        </div>
        <div id="maps" ref="mapContainer" style="width:100%;height:725px; "></div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '@/api'
import FranchiseInfo from '@/components/map/FranchiseInfo.vue'

const { VITE_KAKAO_MAP_KEY } = import.meta.env

const mapContainer = ref(null)
const map = ref(null)
const markers = ref([])  // 마커와 관련 데이터 담기
const selectedStore = ref(null)

const fetchMarkers = async () => {
  try {
    const response = await apiClient.get('/franchise/locations')
    return response.data || []
  } catch (error) {
    console.error('마커 데이터 불러오기 실패:', error)
    return []
  }
}

const loadMap = async (container) => {
  const script = document.createElement('script')
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${VITE_KAKAO_MAP_KEY}&autoload=false&libraries=clusterer`
  document.head.appendChild(script)

  script.onload = () => {
    window.kakao.maps.load(async () => {
      const kakao = window.kakao
      const options = {
        center: new kakao.maps.LatLng(37.53847885, 127.124794),
        level: 6,
      }
      map.value = new kakao.maps.Map(container, options)

      const imageSrc = 'https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/f4ef9e77-3f9c-47a7-a5bd-628e9c6a9053_1495574607-map-location-solid-style-26_84557.png'
      const imageSize = new kakao.maps.Size(40, 40)
      const imageOption = { offset: new kakao.maps.Point(27, 69) }
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

      const clusterer = new kakao.maps.MarkerClusterer({
        map: map.value,
        averageCenter: true,
        minLevel: 8,
      })

      const storeList = await fetchMarkers()
      markers.value = storeList.map(store => {
        const position = new kakao.maps.LatLng(store.latitude, store.longitude)
        const marker = new kakao.maps.Marker({
          map: map.value,
          position,
          image: markerImage,
          title: store.name,
        })

        const infowindow = new kakao.maps.InfoWindow({
          content: `<div style="padding:5px;"><span class="title">${store.name}</span></div>`,
          removable: true,
        })

        kakao.maps.event.addListener(marker, 'click', () => {
          infowindow.open(map.value, marker)
          selectedStore.value = store
        })

        return { marker, store, infowindow }
      })

      clusterer.addMarkers(markers.value.map(m => m.marker))
    })
  }
}

const handleFocusMarker = (franchiseId) => {
  if (!map.value || markers.value.length === 0) return
  const kakao = window.kakao

  const target = markers.value.find(m => m.store.franchiseId === franchiseId)
  if (target) {
    const position = target.marker.getPosition()
    map.value.setCenter(position)
    map.value.setLevel(4)
    kakao.maps.event.trigger(target.marker, 'click')
  } else {
    alert('해당 가맹점의 마커를 찾을 수 없습니다.')
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

</style> 적용시켜줭