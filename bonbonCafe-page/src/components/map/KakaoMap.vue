<template>
    <div>
        <div id="maps" ref="mapContainer" style="width:100%;height:600px; "></div>
    </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import apiClient from '@/api' ;
    const {VITE_KAKAO_MAP_KEY} = import.meta.env;
    const mapContainer = ref(null)


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
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${VITE_KAKAO_MAP_KEY}&autoload=false`
  document.head.appendChild(script)

  script.onload = async () => {
    window.kakao.maps.load(async () => {
      const options = {
        center: new window.kakao.maps.LatLng(37.4972146715141, 126.927607128836),
        level: 13
      }

      const map = new window.kakao.maps.Map(container, options)

      const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/2012/img/marker_p.png'
      const imageSize = new kakao.maps.Size(40, 40)
      const imageOption = { offset: new kakao.maps.Point(27, 69) }
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

      const markerList = await fetchMarkers()

      markerList.forEach(store => {
        const markerPosition = new kakao.maps.LatLng(store.latitude, store.longitude)

        const marker = new kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
          title: store.name
        })

        marker.setMap(map)

        const iwContent = `<div style="padding:5px;"><span class="title">${store.name}</span></div>`

        const infowindow = new kakao.maps.InfoWindow({
          content: iwContent,
          removable: true
        })


        // click event 화면에 해당 가맹점 조회??
        kakao.maps.event.addListener(marker, 'click', function () {
          infowindow.open(map, marker)
        })
      })
    })
  }
}

onMounted(() => {
  loadMap(mapContainer.value)
})
</script>