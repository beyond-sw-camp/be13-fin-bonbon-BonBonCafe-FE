
// Vue Router 설정 코드 - 페이지 간 이동 처리 라이브러리

import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const AuthLayout = () => import('@/layout/AuthLayout.vue');
const BaseLayout = () => import('@/layout/BaseLayout.vue');
const Login = () => import('@/views/auth/Login.vue');
const NotFound = () => import('@/views/common/NotFound.vue');
const MainView = () => import('@/views/MainView.vue')

const FranchiseeAccount = () => import('@/views/accounts/FranchiseeAccount.vue')
const FranchiseeAccountListView = () => import('@/views/accounts/FranchiseeAccountListView.vue')
const ManagerAccounts = () => import('@/views/accounts/ManagerAccount.vue')
const ManagerAccountListView = () => import('@/views/accounts/ManagerAccountListView.vue')
const FranchiseeAccountEditView = () => import('@/views/accounts/FranchiseeAccountEditView.vue')

const FranchiseListForMenu = () => import('@/views/franchise/FranchiseListForMenu.vue')
const FranchiseMenuList = () => import('@/views/menu/FranchiseMenuList.vue')
const MenuList = () => import('@/views/menu/MenuList.vue')
const MenuRegister = () => import('@/views/menu/MenuRegister.vue')
const MenuDetail = () => import('@/views/menu/MenuDetail.vue')
const MenuEdit = () => import('@/views/menu/MenuEdit.vue')
const FranchiseMenuById = () => import('@/views/menu/FranchiseMenuById.vue')

const MyHeadquarterInfo = () => import('@/views/headquarter/MyHeadquarterInfo.vue')
const EditHeadquarter = () => import('@/views/headquarter/EditHeadquarter.vue')

const StockOrder = () => import('@/views/stock/StockOrder.vue')
// const StockHistoryEdit = () => import('@/views/stock/StockHistoryEdit.vue')
const FranchiseOrderList = () => import('@/views/stock/FranchiseOrderList.vue')
const FranchiseStockList = () => import('@/views/stock/FranchiseStockList.vue')
const HeadquarterStockList = () => import('@/views/stock/HeadquarterStockList.vue')
const StockOrderHistory = () => import('@/views/stock/StockOrderHistory.vue')
const StockHistoryDetail = () => import('@/views/stock/StockHistoryDetail.vue')
const HeadquarterStockRegister = () => import('@/views/stock/HeadquarterStockRegister.vue')
const HeadquarterStockDetail = () => import('@/views/stock/HeadquarterStockDetail.vue')
const HeadquarterStockEdit = () => import('@/views/stock/HeadquarterStockEdit.vue')

const FranchiseList = () => import('@/views/franchise/FranchiseList.vue')
const FranchiseRegister = () => import('@/views/franchise/FranchiseRegister.vue')
const MapView = () => import('@/views/franchise/MapView.vue')

const SalesAnalysis = () => import('@/views/sales/SalesAnalysis.vue')
const SalesForecast = () => import('@/views/sales/SalesForecast.vue')

const NoticeList = () => import('@/views/board/NoticeList.vue')
const NoticeRegister = () => import('@/views/board/NoticeRegister.vue')
const NoticeDetail = () => import('@/views/board/NoticeDetail.vue')
const EventList = () => import('@/views/board/EventList.vue')
const EventRegister = () => import('@/views/board/EventRegister.vue')
const EventDetail = () => import('@/views/board/EventDetail.vue')
const NoticeEdit = () => import('@/views/board/NoticeEdit.vue')

// createRouter : Vue Router 설정 함수 
const router = createRouter({
  // 라우터가 사용할 라우팅 모드 지정 (HTML 5 모드)
  history: createWebHistory(import.meta.env.BASE_URL),
  // 요청 경로에 따라 렌더링 할 컴포넌트 배열로 지정
  // 명명된 라우트
  // routes: [
  //   { path: '/', name: 'home', component: Home },
  //   { path: '/departments', name: 'departments', component: Departments },
  //   // 동적 라우트는 일정한 패턴의 URI 경로를 하나의 라우트에 연결하는 방법이다.
  //   { path: '/departments/:no', name: 'departments/no', component: DepartmentDetail },
  //   { path: '/departments/add', name: 'departments/add', component: AddDepartment },
  //   // 404 라우트
  //   { path: '/:paths(.*)*', name: 'notfound', component: NotFound}
  // ],

  // 중첩된 라우트
  // RouterView에 의해서 렌더링된 컴포넌트가 다시 RouterView를 이용해 자식 라우트에 매칭된 컴포넌트를 렌더링한다. 
  routes: [
    {
      path: '/',
      name: 'base',
      component: BaseLayout,
      children: [
        {
          path:'',
          name: 'main',
          component: MainView,
        },
        {
          path:'franchisee-accounts/:userId',
          name: 'franchisee-accounts',
          component: FranchiseeAccount,
        },
        {
          path:'franchisee-accounts',
          name: 'franchisee-accounts-list',
          component: FranchiseeAccountListView,
        },
        {
          path:'franchisee-accounts/:userId/edit',
          name:'franchisee-accounts-edit',
          component: FranchiseeAccountEditView
        },
        {
          path:'manager-accounts/:managerId',
          name: 'manager-accounts',
          component: ManagerAccounts,
        },
        {
          path:'manager-accounts',
          name: 'manager-accounts-list',
          component: ManagerAccountListView,
        },
        {
          path: 'headquarters/:headquarterId/menus',
          path: 'franchise-menu-list',
          name: 'franchise-menu-list',
          component: FranchiseMenuList,
        },
        {
          path: '/headquarters/info',
          name: 'headquarter-info',
          component: MyHeadquarterInfo
        },
        {
          path: '/headquarters/edit',
          name: 'headquarter-edit',
          component: EditHeadquarter
        },
        {
          path: 'headquarters/menus',
          name: 'menu-list',
          component: MenuList,
        },
        {
          path: 'headquarters/menus/:menuId',
          name: 'menu-detail',
          component: MenuDetail,
        },
        {
          path: 'headquarters/menus/:menuId/edit',
          name: 'menu-edit',
          component: MenuEdit,
        },
        {
          path:'menu-register',
          name: 'menu-register',
          component: MenuRegister,
        },
        {
          path:'stock-order',
          name: 'stock-order',
          component: StockOrder,
        },
        {
          path:'franchise-stock-list',
          name: 'franchise-stock-list',
          component: FranchiseStockList,
        },
        {
          path: '/headquarters/stocks',
          name: 'headquarter-stock-list',
          component: HeadquarterStockList,
        },
        {
          path:'stock-order-history',
          name: 'stock-order-history',
          component: StockOrderHistory,
        },
        {
          path: '/stocks/:historyId/detail',          
          name: 'stock-history-detail',
          component: StockHistoryDetail,
        },
        {
          path: 'headquarter-stock-register',
          name: 'headquarter-stock-register',
          component: HeadquarterStockRegister
        },
        {
          path: 'headquarter-stocks/:headquarterStockId',
          name: 'headquarter-stock-detail',
          component: HeadquarterStockDetail,
        },
        {
          path: 'headquarter-stocks/:headquarterStockId/edit',
          name: 'headquarter-stock-edit',
          component: HeadquarterStockEdit,
        },
        // {
        //   path: '',
        //   // path: '/headquarters/:headquarterId/franchise/:franchiseId/stocks/:historyId/edit',
        //   name: 'stock-history-edit',
        //   component: StockHistoryEdit,
        // },
        {
          path:'franchise-register',
          name: 'franchise-register',
          component: FranchiseRegister,
        },
        {
          path: 'headquarters/franchise-order-list',
          name: 'franchise-order-list',
          component: FranchiseOrderList,
        },
        {
          path:'franchise-list',
          name: 'franchise-list',
          component: FranchiseList,
        },
        {
          path: '/headquarters/franchise-menu-list',
          name: 'franchise-menu-franchise-list',
          component: FranchiseListForMenu,
        },
        {
          path: '/headquarters/franchise-menu-list/:franchiseId',
          name: 'franchise-menu-by-id',
          component: FranchiseMenuById,
        },
        {
          path:'kakao-map',
          name: 'kakao-map',
          component: MapView,
        },
        {
          path:'sales-analysis',
          name: 'sales-analysis',
          component: SalesAnalysis,
        },
        {
          path:'sales-forecast',
          name: 'sales-forecast',
          component: SalesForecast,
        },
        {
          path:'notice-list',
          name: 'notice',
          component: NoticeList,
        },
        {
          path: 'notices/:noticeId/edit',
          name: 'notice-edit',
          component: NoticeEdit,
        },
        {
          path:'event-list',
          name: 'event',
          component: EventList,
        },
        {
          path: 'notice-register',
          name: 'notice-register',
          component: NoticeRegister,
        },
        {
          path: 'event-register',
          name: 'event-register',
          component: EventRegister,
        },
        {
          path: '/events/:noticeId/edit',
          name: 'event-edit',
          component: NoticeEdit,
        },
        {
          path: '/headquarters/notices/:noticeId',
          name: 'notice-detail',
          component: NoticeDetail
        },
        {
          path: '/headquarters/events/:noticeId',
          name: 'event-detail',
          component: EventDetail
        }
      ]
    },
    {
      path: '/user',
      name: 'auth',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: 'login',
          component: Login
        }
      ]
    },
    // 404 라우트 -> 존재하지 않는 페이지 접근 시 NotFound 페이지 표시
    { 
      path: '/:paths(.*)*', 
      name: 'notfound', 
      component: NotFound
    }
  ],
});

// 네비게이션 가드
//  - 라우팅이 일어날 때 프로그래밍 방식으로 네비게이션을 안전하게 보호하는 기능을 수행한다.
//  - 네비게이션 가드는 라우트하는 경로가 바뀔 때 반응한다.
//  - beforeEach(목표 라우트 객체, 현재 라우트 객체, 다른 라우트 리다이렉트트)
router.beforeEach((to, from, next) => {
  // 라우트가 변경되기 전에 실행되는 가드 -> 라우팅 제어 및 조건에 맞지 않는 경로의 이동을 막을 수 있음
  const authStore = useAuthStore(); 

  if(to.name === 'login' && authStore.isLoggedIn){
    // 이미 로그인 했는데 로그인 페이지로 이동하는 경우 
    next({name: 'base'});
  }

  // 로그인 페이지가 아니고, 로그인 상태가 아니면 로그인 페이지로 리다이렉트한다.
  // 로그인하지 않은 상태에서 로그인 페이지가 아닌 다른 페이지로 가는 경우, 로그인페이지로 리다이렉트 되도록
  if(to.name !== 'login' && !authStore.isLoggedIn) {
    next({name: 'login'});
  } else {
    next();
  }
});

export default router
