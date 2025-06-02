<template>
  <RouterView></RouterView>

  <ChatBot/>
</template>

<script setup>
  import ChatBot from './components/common/chatBot.vue';
import { useAuthStore } from './stores/auth';
  // import { KakaoMap } from 'vue3-kakao-maps';

  

  const authStore = useAuthStore();

  authStore.checkLogin();
</script>