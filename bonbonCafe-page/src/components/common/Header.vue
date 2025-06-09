<template>
  <v-app-bar flat class="transparent-app-bar">
    <v-spacer />

    <!-- 사용자 프로필 메뉴 (v-menu 사용) -->
    <v-menu v-model="menu" :close-on-content-click="false" location="end">
      <template v-slot:activator="{ props }">
        <v-btn
          variant="text"
          stacked
          class="d-flex align-center pa-0"
          v-bind="props"
        >
          <v-list>
            <v-list-item
              :prepend-avatar="userInfo.userImage || 'https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/profile-default.jpg'"
              :subtitle="userInfo.username"
              :title="userInfo.name"
            ></v-list-item>
          </v-list>
        </v-btn>
      </template>

      <!-- 프로필 정보 카드 -->
      <v-card min-width="300">
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Email</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>사용자명</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.name }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>전화번호</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.phone }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>소속 본사</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.franchiseName }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>사용자 역할</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.role }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          
        </v-list>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="menu = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <!-- 로그아웃 버튼 -->
    <v-btn variant="text" stacked color="black" @click="logout">
      <v-icon icon="mdi-logout"></v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const userInfo = authStore.userInfo;
const menu = ref(false);  // 메뉴 상태를 ref로 관리하여 열리고 닫히도록 설정

const logout = () => {
  if (confirm('정말로 로그아웃하시겠습니까?')) {
    authStore.logout();
  }
};
</script>

<style scoped>
.transparent-app-bar {
  box-shadow: none !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  z-index: 2000 !important;
  position: relative;
}

.v-card {
  min-width: 300px;
  padding: 16px;
}

.v-list-item-title {
  font-weight: 500;
}

.v-list-item-subtitle {
  color: #777;
}
</style>
