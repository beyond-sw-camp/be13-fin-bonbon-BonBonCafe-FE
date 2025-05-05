<template>
    <v-app>
      <!-- Sidebar -->
      <v-navigation-drawer
        v-model="drawer"
        app
        color="indigo-darken-4"
        dark
        permanent
      >

      <template v-slot:prepend>
          <v-list-item
            lines="two"
          ></v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list v-model:opened="opened">
        <v-list-group value="Franchise">
            <template v-slot:activator="{ props }">
                <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-coffee-outline"
                    title="가맹점 관리"
                ></v-list-item>
            </template>
            <v-list-item 
                v-for="(item, i) in franchise"
                :key="i"
                :prepend-icon="item.icon"
                :title="item.title"
            ></v-list-item>
        </v-list-group>
      </v-list>

      <v-list v-model:opened="opened">
        <v-list-group value="Menu">
            <template v-slot:activator="{ props }">
                <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-silverware-fork-knife"
                    title="메뉴 관리"
                ></v-list-item>
            </template>
            <v-list-item 
                v-for="(item, i) in menu"
                :key="i"
                :prepend-icon="item.icon"
                :title="item.title"
            ></v-list-item>
        </v-list-group>
      </v-list>

      <v-list v-model:opened="opened">
        <v-list-group value="Sales">
            <template v-slot:activator="{ props }">
                <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-chart-bar"
                    title="매출 분석"
                ></v-list-item>
            </template>
            <v-list-item 
                v-for="(item, i) in sales"
                :key="i"
                :prepend-icon="item.icon"
                :title="item.title"
            ></v-list-item>
        </v-list-group>
      </v-list>

      <v-list v-model:opened="opened">
        <v-list-group value="Notice">
            <template v-slot:activator="{ props }">
                <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-clipboard-check-outline"
                    title="공지사항"
                ></v-list-item>
            </template>
            <v-list-item 
                v-for="(item, i) in notice"
                :key="i"
                :prepend-icon="item.icon"
                :title="item.title"
            ></v-list-item>
        </v-list-group>
      </v-list>

      <v-list v-model:opened="opened">
        <v-list-group value="Account">
            <template v-slot:activator="{ props }">
                <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-account-circle-outline"
                    title="계정 관리"
                ></v-list-item>
            </template>
            <v-list-item 
                v-for="(item, i) in account"
                :key="i"
                :prepend-icon="item.icon"
                :title="item.title"
            ></v-list-item>
        </v-list-group>
      </v-list>

      </v-navigation-drawer>
      
    </v-app>
  </template>
  
  <script setup>
  import { ref } from 'vue';

  const opened = ref([]); 
  const drawer = ref(true);

  const franchise = [
    { title: '가맹점 조회', icon: 'mdi-magnify' },
    { title: '가맹점 등록', icon: 'mdi-office-building-plus' },
  ];

  const menu = [
    { title: '메뉴 조회', icon: 'mdi-magnify' },
    { title: '메뉴 등록', icon: 'mdi-menu' },
  ];

  const sales = [
    { title: '매출 분석', icon: 'mdi-trending-up' },
    { title: '매출 예측', icon: 'mdi-lightbulb-on-10' },
  ];
  
  const notice = [
    { title: '공지사항', icon: 'mdi-bell-outline' },
    { title: '이벤트', icon: 'mdi-calendar-text' },
  ];

  const account = [
    { title: '가맹점주 관리', icon: 'mdi-chef-hat' },
    { title: '담당자 관리', icon: 'mdi-pencil-outline' },
  ];
  
  const navigate = (item) => {
    console.log(`Navigating to ${item.title}`);
  };
  </script>
  
  <style scoped>
  .v-navigation-drawer {
    max-width: 250px;
  }
  
  .main-bg {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-top: 16px;
  }
  
  .v-list-item {
    cursor: pointer;
    padding: 12px 16px;
  }

  .v-list-group__items {
  transition-duration: 0ms !important; /* 기본은 300ms 정도 */
}
  </style>
  