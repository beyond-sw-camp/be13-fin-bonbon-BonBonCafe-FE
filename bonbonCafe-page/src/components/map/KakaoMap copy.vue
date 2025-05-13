<template>
    <div>
        <div id="maps" ref="mapContainer" style="width:80%;height:600px; "></div>
    </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import apiClient from '@/api' ;
    const {VITE_KAKAO_MAP_KEY} = import.meta.env;


    // 이전에 좌표 가져오기
    onMounted(()=>{
        loadMap(mapContainer.value)
    })

    const mapContainer = ref(null)

    const y = ref(37.4972146715141)
    const x = ref(126.927607128836)


    const fetchMarkers = async () => {
    try {
        const response = await apiClient.get('/franchise/locations') // 백엔드에 맞게 조정
        return response.data
    } catch (error) {
        console.error('마커 데이터 불러오기 실패:', error)
        return []
    }
    }


    const loadMap = (mapContainer) =>{
        const script = document.createElement('script')
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${VITE_KAKAO_MAP_KEY}&autoload=false`
        document.head.appendChild(script)
    
        script.onload = () =>{
            window.kakao.maps.load(()=>{
                const options = {
                    center: new window.kakao.maps.LatLng(37.4972146715141, 126.927607128836), // 지도의 중심좌표
                    level: 13,
                    // maxLevel: 5,
                }
                // const mapInstance = new  window.kakao.maps.Map(mapContainer.value, options) // 지도를 생성합니다
                const map = new window.kakao.maps.Map(mapContainer, options) // 지도 생성

                const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png', // 마커이미지의 주소입니다    
                imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
                imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
      

                // 마커가 표시될 위치
                const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),markerPosition = new kakao.maps.LatLng(y.value, x.value);

                const marker = new kakao.maps.Marker({
                    position: markerPosition,
                    image: markerImage, //마커 이미지 설정
                    // clickable: true 
                })

                marker.setMap(map)

                
                // 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
                const iwContent = '<div style="padding:5px;"><span class="title">보래매로 87</span></div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
                iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

                // 인포윈도우를 생성합니다
                const infowindow = new kakao.maps.InfoWindow({
                    content : iwContent,
                    removable : iwRemoveable
                });

                // 마커에 클릭이벤트를 등록합니다
                kakao.maps.event.addListener(marker, 'click', function() {
                    // 마커 위에 인포윈도우를 표시합니다
                    infowindow.open(map, marker);  
                });

            })
        }
    }

   
   
</script>
