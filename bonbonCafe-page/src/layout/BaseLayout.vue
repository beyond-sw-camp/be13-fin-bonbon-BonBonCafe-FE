<template>
  <div class="app-container">
    <Header />
    <div class="content-wrapper">
      <Sidebar />
      <main class="main-content">
        <RouterView />
        <div>
          <h1>Main Content</h1>
          <p>This is the main page of the application.</p>
        </div>
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import Footer from '@/components/common/Footer.vue';
import Header from '@/components/common/Header.vue';
import Sidebar from '@/components/common/Sidebar.vue';
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
}

main.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

Sidebar {
  width: 250px; /* 원하는 너비로 조정 */
  flex-shrink: 0;
}

Header {
  height: 60px; /* 원하는 높이로 조정 */
  flex-shrink: 0;
}

Footer {
  height: 40px; /* 원하는 높이로 조정 */
  flex-shrink: 0;
}
</style>
