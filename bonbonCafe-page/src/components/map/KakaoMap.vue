<template>
  <div id="map-container">
    <div v-if="selectedStore" id="info">
      <FranchiseInfo :selectedStore="selectedStore" @focus-marker="handleFocusMarker" />
    </div>
    <div id="maps" ref="mapContainer" style="width: 100%; height: 900px;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import apiClient from '@/api'
import FranchiseInfo from '@/components/map/FranchiseInfo.vue'

const { VITE_KAKAO_MAP_KEY } = import.meta.env

const mapContainer = ref(null)
const map = ref(null)
const markers = ref([]) // 마커와 관련 데이터
const selectedStore = ref(null)
const currentOverlay = ref(null) // 현재 표시 중인 오버레이

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
        level: 4,
      }
      map.value = new kakao.maps.Map(container, options)

      const imageSrc = 'https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/777fb5c7-ac23-4567-b993-9cd5d899aa38_free-icon-fast-food-4958939.png'
      const imageSize = new kakao.maps.Size(40, 40)
      const imageOption = { offset: new kakao.maps.Point(50, 69) }
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

      const clusterer = new kakao.maps.MarkerClusterer({
        map: map.value,
        averageCenter: true,
        minLevel: 6,
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

        kakao.maps.event.addListener(marker, 'click', () => {
          // 기존 오버레이 닫기
          if (currentOverlay.value) {
            currentOverlay.value.setMap(null)
            currentOverlay.value = null
          }

          // 오버레이 DOM 생성
          const overlayContent = document.createElement('div')
          overlayContent.style.cssText = `
            background: white;
            border-radius: 10px;
            padding: 10px;
            width: 220px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            position: relative;
          `

          overlayContent.innerHTML = `
            <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">${store.name}</div>
            <img src="${store.franchiseImage}" 
                alt="${store.name}" 
                onerror="this.src='https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/profile-default.jpg'"
                style="width: 100%; height: auto; border-radius: 5px; object-fit: cover;" />
            <button style="
              position: absolute;
              top: 5px;
              right: 5px;
              background: transparent;
              border: none;
              font-size: 18px;
              cursor: pointer;
              color: #999;
            " class="close-btn">&times;</button>
          `

          const overlay = new kakao.maps.CustomOverlay({
            content: overlayContent,
            position: position,
            xAnchor: 0.6,
            yAnchor: 4.0,
          })

          overlay.setMap(map.value)
          currentOverlay.value = overlay
          selectedStore.value = store

          overlayContent.querySelector('.close-btn').addEventListener('click', () => {
            overlay.setMap(null)
            currentOverlay.value = null
          })
        })

        return { marker, store }
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

watch(selectedStore, (newVal) => {
  console.log('selectedStore changed:', newVal)
})
</script>

<style scoped>
#map-container {
  display: flex;
  flex-direction: row;
  height: 900px;
}

#info {
  width: 300px;
  padding: 10px;
  flex-shrink: 0;
  background-color: #f5f5f5;
  height: 900px;
  overflow-y: auto;
  box-sizing: border-box;
}

#maps {
  flex: 1;
  height: 100%;
  border: 1px solid #ccc;
}
</style>
