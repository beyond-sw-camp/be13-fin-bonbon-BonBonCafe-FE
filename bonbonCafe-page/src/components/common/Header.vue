<template>

    <v-app-bar flat class="transparent-app-bar" > 

      <!-- <v-btn icon="mdi-table-chair" variant="text" color="black" /> -->

      <!-- <v-toolbar-title color="black"black>BonBon-Cafe</v-toolbar-title> -->
      
      <v-spacer />
      <v-btn
        variant="text"
        stacked
        class="d-flex align-center pa-0"
      >
        <v-list>
          <v-list-item
          :prepend-avatar="userInfo.userImage || 'https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/profile-default.jpg'"
          :subtitle="userInfo.username"
          :title="userInfo.name"
          ></v-list-item>
        </v-list>
      </v-btn>

      <v-btn
        variant="text"
        stacked
        color="black" @click="logout"
      >
        <v-icon icon="mdi-logout"></v-icon>
      </v-btn>

      <!-- <v-btn color="black" variant="text" @click="logout">Logout</v-btn> -->

    </v-app-bar>

</template>

<script setup>

import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const isLoggedIn = authStore.isLoggedIn;
const userInfo = authStore.userInfo;

const logout = () => {
   if (confirm('정말로 로그아웃하시겠습니까?')) {
        authStore.logout();
    }
};

</script>

<style scoped>

.transparent-app-bar {
  /* background-color: transparent !important; */
  box-shadow: none !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  z-index: 2000 !important; /* Vuetify 기준 상위 우선순위 */
  position: relative; /* z-index가 적용되려면 position 필요 */
}


</style>