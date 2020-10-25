import { AuthService } from '@/services/AuthService';
import Login from '@/views/Dashboard/Auth/Login.vue';
import Dashboard from '@/views/Dashboard/Dashboard.vue';
import DashboardHome from '@/views/Dashboard/DashboardHome.vue';
import { RouteConfig } from 'vue-router';

const authService = AuthService.getInstance();

/**
 * Helper to check user access against app abilities
 *
 * @param action
 * @param subject
 */
function can(action: any, entity: any): boolean {
  return authService.getAbility().can(action, entity);
}

const config: Array<RouteConfig> = [{
  path: '/dashboard',
  component: Dashboard,
  children: [
    {
      path: '',
      redirect: 'dashboard-login',
    },
    {
      path: 'home',
      name: 'dashboard-home',
      component: DashboardHome,
      beforeEnter: (to, from, next) => {
        if (can('read', 'Report')) {
          return next();
        }
        return next({ name: 'orders-list' });
      },
      meta: {
        requiresAuth: true,
        layout: 'dashboard',
      },
    },
    {
      path: 'settings',
      name: 'dashboard-settings',
      component: () => import(/* webpackChunkName: "Settings" */ '@/views/Dashboard/Settings.vue'),
      meta: {
        requiresAuth: true,
        layout: 'dashboard',
      },
    },
    {
      path: 'login',
      name: 'dashboard-login',
      component: Login,
      meta: {
        layout: 'full-screen',
      },
    },
    {
      path: 'logout',
      name: 'dashboard-logout',
      component: () => import(/* webpackChunkName: "Auth" */ '@/views/Dashboard/Auth/Logout.vue'),
      meta: {
        layout: 'full-screen',
      },
    },
  ],
}];

export default config;
