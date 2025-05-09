<template>
  <RouterView></RouterView>
</template>

<script setup>

  import { useAuthStore } from './stores/auth';
  // import { loadKakao } from 'vue3-kakao-maps'; 

  // const kakaoApiKey = import.meta.env.VITE_KAKAO_API_KEY;

  // Kakao API 초기화
  // loadKakao({ apiKey: kakaoApiKey });

  const authStore = useAuthStore();
  authStore.checkLogin();
</script>