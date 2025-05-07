<template>
  <v-layout class="rounded rounded-md border">
    <Sidebar />

    <v-main class="d-flex align-center justify-center main-bg" height="100%">
      <Header />

      <v-container>
        <RouterView/>
      </v-container>
    </v-main>

    <Footer />
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
  background-color: #fffff4;
  min-height: 100vh;
  padding-top: 70px;
}
</style>
