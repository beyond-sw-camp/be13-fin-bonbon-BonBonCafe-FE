<template>
  <v-navigation-drawer v-model="drawer" app class="custom-drawer" dark permanent name="drawer">
    <div class="d-flex align-center pa-4">
      <v-img
        src="https://bonbon-file-bucket.s3.ap-northeast-2.amazonaws.com/bonbon-logo-banner(white).png"
        alt="BonBon Cafe Logo"
        max-width="150"
        class="mr-3"
      />
    </div>

    <v-divider></v-divider>

    <v-list v-model:opened="opened">
      <template v-for="(group, index) in menuGroups" :key="index">
        <v-list-group :value="group.title">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :prepend-icon="group.icon" :title="group.title" />
          </template>
          <v-list-item
            v-for="(item, i) in group.items"
            :key="i"
            :title="item.title"
            @click="navigate(item.title)"
            :class="{ 'active-item': isActive(item.title) }"
          />
        </v-list-group>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const drawer = ref(true)
const opened = ref([])

const authStore = useAuthStore()
const userRole = computed(() => authStore.userInfo.role)

const menuGroups = [
  {
    title: '가맹점 관리',
    icon: 'mdi-coffee-outline',
    items: [
      { title: '가맹점 조회' },
      { title: '가맹점 등록' },
      { title: 'kakao map' },
    ],
  },
  {
    title: '본사',
    icon: 'mdi-office-building',
    items: [{ title: '내 본사 정보' }],
  },
  {
    title: '메뉴 관리',
    icon: 'mdi-silverware-fork-knife',
    items:
      userRole.value === 'ROLE_HEADQUARTER'
        ? [
            // { title: '가맹점 메뉴 조회' },
            { title: '전체 메뉴 조회' },
            { title: '메뉴 등록' },
          ]
        : [
            { title: '가맹점 메뉴 조회' },
            { title: '전체 메뉴 조회' },
          ],
  },
  {
    title: '재고&발주 관리',
    icon: 'mdi-warehouse',
    items:
      userRole.value === 'ROLE_FRANCHISEE'
        ? [
            { title: '재고 조회' },
            { title: '재고 주문' },
            { title: '재고 주문 내역' },
          ]
        : userRole.value === 'ROLE_HEADQUARTER'
        ? [
            { title: '본사 재고 조회' },
            { title: '가맹점 발주 내역' },
          ]
        : [],
  },
  {
    title: '매출 관리',
    icon: 'mdi-chart-bar',
    items: [
      { title: '매출 분석' },
      { title: '매출 순위' },
    ],
  },
  {
    title: '공지사항',
    icon: 'mdi-clipboard-check-outline',
    items: [
      { title: '공지사항' },
      { title: '이벤트' },
    ],
  },
  {
    title: '계정 관리',
    icon: 'mdi-account-circle-outline',
    items: [
      { title: '가맹점주 관리' },
      { title: '담당자 관리' },
    ],
  },
]

const routeMap = {
  '가맹점주 관리': {name : 'franchisee-accounts-list' },
  '담당자 관리': {name :'manager-accounts-list'},
  '가맹점 메뉴 조회': computed(() =>
    userRole.value === 'ROLE_HEADQUARTER'
      ? { name: 'franchise-menu-franchise-list' }
      : { name: 'franchise-menu-list' }
  ).value,
  '전체 메뉴 조회': { name: 'menu-list' },
  '메뉴 등록': '/menu-register',
  '재고 조회': '/franchise-stock-list',
  '본사 재고 조회': { name: 'headquarter-stock-list' },
  '재고 주문': '/stock-order',
  '재고 주문 내역': '/stock-order-history',
  '가맹점 발주 내역': { name: 'franchise-order-list' },
  '가맹점 조회': '/franchise-list',
  '가맹점 등록': '/franchise-register',
  '내 본사 정보': { name: 'headquarter-info' },
  '본사 정보 수정': { name: 'headquarter-edit' },
  'kakao map': '/kakao-map',
  '매출 분석': '/sales-analysis',
  '매출 순위': '/sales-ranking',
  '공지사항': '/notice-list',
  '이벤트': '/event-list',
}

const navigate = (title) => {
  const path = routeMap[title]
  if (path) {
    router.push(path)
  }
}

const isActive = (title) => {
  const path = routeMap[title]
  if (!path) return false
  if (typeof path === 'string') {
    return route.path === path
  }
  if (typeof path === 'object' && path.name) {
    return route.name === path.name
  }
  return false
}
</script>

<style scoped>
.v-navigation-drawer {
  max-width: 250px;
}

.custom-drawer {
  background-color: #2A3663 !important;
  color: white !important;
}

.v-list-item {
  cursor: pointer;
  padding: 12px 16px;
}

.v-list-group__items {
  transition-duration: 0ms !important;
}

.active-item {
  background-color: rgba(255, 255, 255, 0.1);
  font-weight: bold;
}
</style>