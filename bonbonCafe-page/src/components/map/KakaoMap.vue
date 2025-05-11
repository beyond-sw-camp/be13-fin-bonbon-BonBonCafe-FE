<template>
    <div>
        <div ref="mapContainer" style="width:80%;height:600px; "></div>
    </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue'
    const {VITE_KAKAO_MAP_KEY} = import.meta.env;


    // 이전에 좌표 가져오기
    onMounted(()=>{
        loadMap(mapContainer.value)
    })

    const mapContainer = ref(null)

    const loadMap = (container) =>{
        const script = document.createElement('script')
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${VITE_KAKAO_MAP_KEY}&autoload=false`
        document.head.appendChild(script)
    
        script.onload = () =>{
            window.kakao.maps.load(()=>{
                const options = {
                    center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
                    level: 3,
                    maxLevel: 5,
                }
                // const mapInstance = new  window.kakao.maps.Map(mapContainer.value, options) // 지도를 생성합니다
                const mapInstance = new window.kakao.maps.Map(container, options) // 지도 생성

                // 마커가 표시될 위치
                const markerPosition = new kakao.maps.LatLng(33.450701, 126.570667)

                const marker = new kakao.maps.Marker({
                    position: markerPosition,
                })

                marker.setMap(mapInstance)
            })
        }
    }

   
   
</script>
