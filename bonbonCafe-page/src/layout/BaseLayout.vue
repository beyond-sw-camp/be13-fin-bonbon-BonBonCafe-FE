<template>
  <v-layout class="rounded rounded-md border" >
    <Sidebar/>
    
    <Header/>
    
      <v-main class="d-flex align-center justify-center main-bg" height="100%">
      <!-- <v-main class="d-flex flex-column main-bg"  style="width: 100%; height: 130vh;"> -->

        <v-container fluid class="pa-0">
          <RouterView/>
        </v-container>
        
      </v-main>
      
      <!-- <Footer /> -->
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
  
}
</style>
