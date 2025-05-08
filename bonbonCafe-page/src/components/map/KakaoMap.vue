<template>
    <div>
        <div id="map" ref="mapContainer" style="width:80%;height:600px; "></div>
    </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue'
   
   
    const {VITE_KAKAO_API_KEY} = import.meta.env;

    const mapContainer = ref(null)

    const loadMap = () =>{
        const script = document.createElement('script')
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${VITE_KAKAO_API_KEY}&autoload=false`
        document.head.appendChild(script)
    
        script.onload = () =>{
            window.kakao.maps.load(()=>{
                const options = {
                    center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
                    level: 3,
                }
                const mapInstance = new  window.kakao.maps.Map(mapContainer.value, options) // 지도를 생성합니다
            })
        }
    }

    onMounted(()=>{
        loadMap()
    })
   
</script>
