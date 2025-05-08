<template>
  <v-layout class="rounded rounded-md border">
    <Sidebar />

    <!-- <v-main class="d-flex align-center justify-center main-bg" height="100%"> -->
    <v-main class="d-flex flex-column main-bg"  style="height: 130vh;">
      <Header />

      <v-container
        class="flex-grow-1 v-col-10"
       >
        <RouterView/>
      </v-container>
      <Footer />
    </v-main>

  </v-layout>
</template>

<script setup>
import { RouterView } from 'vue-router';
import Footer from '@/components/common/Footer.vue';
import Header from '@/components/common/Header.vue';
import Sidebar from '@/components/common/Sidebar.vue';
</script>

<style scoped>
.main-bg {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-top: 70px;
}
</style>
