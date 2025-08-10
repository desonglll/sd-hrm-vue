import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import HomePage from '@/views/HomeView.vue'
import LayoutView from '@/views/LayoutView.vue'
import LogoutView from '@/views/auth/LogoutView.vue'
import MePage from '@/views/MeView.vue'
import AboutPage from '@/views/AboutView.vue'
import UserPage from '@/views/manage/user/UserPage.vue'
import UserTable from '@/components/user/UserTable.vue'
import ManagePage from '@/views/ManageView.vue'
import { useAuthStore } from '@/stores/auth.ts'
import ManageIndex from '@/components/manage/ManageIndex.vue'
import UserForm from '@/components/user/UserForm.vue'
import CreateUserView from '@/views/manage/user/CreateUserView.vue'
import ListUserView from '@/views/manage/user/ListUserView.vue'
import DetailUserView from '@/views/manage/user/DetailUserView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutView,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          redirect: 'home',
        },
        {
          path: 'home',
          component: HomePage,
        },
        {
          path: 'me',
          component: MePage,
        },
        {
          path: 'about',
          component: AboutPage,
        },
        {
          path: 'manage',
          component: ManagePage,
          children: [
            {
              path: '',
              component: ManageIndex,
            },
            {
              path: 'user',
              component: UserPage,
              children: [
                {
                  path: 'list',
                  component: ListUserView,
                },
                {
                  path: 'new',
                  component: CreateUserView,
                },
                {
                  path: 'detail/:id',
                  component: DetailUserView,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: '/login',
      component: LoginView,
    },
    {
      path: '/logout',
      component: LogoutView,
    },
  ],
})
router.beforeEach((to, from, next) => {
  const authState = useAuthStore()
  const isLoggedIn = authState.isLoggedIn
  if (to.path === '/login' && isLoggedIn) {
    next('/')
  } else if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
    console.log(isLoggedIn)
    next('/login')
  } else {
    next()
  }
})
export default router
