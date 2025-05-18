<template>
  <RouterView></RouterView>
</template>

<script setup>
  import { useAuthStore } from './stores/auth';
  // import { KakaoMap } from 'vue3-kakao-maps';

  

  const authStore = useAuthStore();

  authStore.checkLogin();
</script>