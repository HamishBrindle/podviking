import Dashboard from '@/views/Dashboard/Dashboard.vue';
import DashboardHome from '@/views/Dashboard/DashboardHome.vue';
import LoginForm from '@/views/Dashboard/Auth/LoginForm.vue';
import Reports from '@/views/Dashboard/Reports/Reports.vue';
import Customers from '@/views/Dashboard/Customers/Customers.vue';
import Orders from '@/views/Dashboard/Orders/Orders.vue';
import { Order } from '@/models/internal';
import { AuthService } from '@/services/AuthService';
import { Route, RouteConfig } from 'vue-router';

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
      redirect: 'login',
    },
    {
      path: 'home',
      name: 'home',
      component: DashboardHome,
      beforeEnter: (to, from, next) => {
        if (can('read', 'Report')) {
          return next();
        }
        return next({ name: 'orders-list' });
      },
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: 'settings',
      name: 'settings',
      component: () => import(/* webpackChunkName: "Settings" */ '@/views/Dashboard/Settings.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: 'login',
      name: 'login',
      meta: {
        layout: 'full-screen',
      },
      component: LoginForm,
    },
    {
      path: 'logout',
      name: 'logout',
      meta: {
        layout: 'full-screen',
      },
      component: () => import(/* webpackChunkName: "Auth" */ '@/views/Dashboard/Auth/Logout.vue'),
    },
    {
      path: 'register',
      name: 'register',
      meta: {
        layout: 'full-screen',
      },
      component: () => import(/* webpackChunkName: "Auth" */ '@/views/Dashboard/Auth/RegisterForm.vue'),
    },
    {
      path: 'confirmation',
      name: 'register-confirmation',
      meta: {
        layout: 'full-screen',
      },
      props: (route) => ({
        confirmationToken: route.query.confirmation_token,
      }),
      component: () => import(/* webpackChunkName: "Auth" */ '@/views/Dashboard/Auth/ConfirmRegistration.vue'),
    },
    {
      path: 'forgotpassword',
      name: 'forgot-password',
      meta: {
        layout: 'full-screen',
      },
      component: () => import(/* webpackChunkName: "Auth" */ '@/views/Dashboard/Auth/ForgotPasswordForm.vue'),
    },
    {
      path: 'resetpassword',
      name: 'reset-password',
      meta: {
        layout: 'full-screen',
      },
      props: (route) => ({
        resetPasswordToken: route.query.reset_password_token,
      }),
      component: () => import(/* webpackChunkName: "Auth" */ '@/views/Dashboard/Auth/ResetPasswordForm.vue'),
    },
    {
      path: 'reports',
      component: Reports,
      beforeEnter: (to, from, next) => {
        if (can('read', 'Report')) {
          return next();
        }
        return next({ name: 'home' });
      },
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: 'phsaordercalculation',
          name: 'phsa-order-calculation',
          component: () => import(/* webpackChunkName: "Reports" */ '@/views/Dashboard/Reports/PHSAOrderCalculation.vue'),
          meta: {
            layout: 'fluid',
          },
        },
        {
          path: 'eocppesupply',
          name: 'eoc-ppe-supply',
          component: () => import(/* webpackChunkName: "Reports" */ '@/views/Dashboard/Reports/EOCPPESupply.vue'),
          meta: {
            layout: 'fluid',
          },
        },
        {
          path: 'ppesupplybycategory',
          name: 'ppe-supply-by-category',
          component: () => import(/* webpackChunkName: "Reports" */ '@/views/Dashboard/Reports/PPESupplyByCategory.vue'),
          meta: {
            layout: 'fluid',
          },
        },
        {
          path: 'ppesupplybysku',
          name: 'ppe-supply-by-sku',
          component: () => import(/* webpackChunkName: "Reports" */ '@/views/Dashboard/Reports/PPESupplyBySku.vue'),
          meta: {
            layout: 'fluid',
          },
        },
        {
          path: 'ordersummary',
          name: 'order-summary',
          component: () => import(/* webpackChunkName: "Reports" */ '@/views/Dashboard/Reports/OrderSummary.vue'),
          meta: {
            layout: 'fluid',
          },
        },
        {
          path: 'ordersummary/details',
          name: 'dist-channel-order-summary',
          component: () => import(/* webpackChunkName: "Reports" */ '@/views/Dashboard/Reports/DistChannelOrderSummary.vue'),
          props: (route) => ({ distChannel: route.query.distChannel }),
          meta: {
            layout: 'fluid',
          },
        },
      ],
    },
    {
      path: 'customers',
      component: Customers,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          redirect: 'customers-list',
        },
        {
          path: 'list',
          name: 'customers-list',
          component: () => import(/* webpackChunkName: "Customers" */ '@/views/Dashboard/Customers/CustomersList.vue'),
        },
        {
          path: 'create/',
          name: 'customers-create',
          component: () => import(/* webpackChunkName: "Customers" */ '@/views/Dashboard/Customers/CustomersCreate.vue'),
        },
        {
          path: ':id',
          name: 'customers-view',
          component: () => import(/* webpackChunkName: "Customers" */ '@/views/Dashboard/Customers/CustomersView.vue'),
          props: (route) => ({
            id: route.params.id,
          }),
          beforeEnter: (to, _from, next) => {
            if (to.params.id) return next();
            throw Error('Missing `id` parameter');
          },
        },
        {
          path: ':id/edit',
          name: 'customers-edit',
          component: () => import(/* webpackChunkName: "Customers" */ '@/views/Dashboard/Customers/CustomersEdit.vue'),
          props: (route) => ({
            id: route.params.id,
          }),
          beforeEnter: (to, _from, next) => {
            if (to.params.id) return next();
            throw Error('Missing `id` parameter');
          },
        },
      ],
    },
    {
      path: 'orders',
      component: Orders,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          redirect: 'orders-list',
        },
        {
          path: 'list',
          name: 'orders-list',
          component: () => import(/* webpackChunkName: "Orders" */ '@/views/Dashboard/Orders/OrdersList.vue'),
        },
        {
          path: 'setup',
          name: 'orders-setup',
          component: () => import(/* webpackChunkName: "Orders" */ '@/views/Dashboard/Orders/OrdersSetup.vue'),
        },
        {
          path: 'create',
          name: 'orders-create',
          component: () => import(/* webpackChunkName: "Orders" */ '@/views/Dashboard/Orders/OrdersCreate.vue'),
          props: (route) => {
            const data = JSON.parse(route.query.order as string);
            return {
              order: new Order(data),
            };
          },
        },
        {
          path: ':id',
          name: 'orders-view',
          component: () => import(/* webpackChunkName: "Orders" */ '@/views/Dashboard/Orders/OrdersView.vue'),
          props: (route: Route) => ({ id: route.params.id }),
          beforeEnter: (to, _from, next) => {
            if (to.params.id) return next();
            throw Error('Missing `id` parameter');
          },
        },
        {
          path: ':id/edit',
          name: 'orders-edit',
          component: () => import(/* webpackChunkName: "Orders" */ '@/views/Dashboard/Orders/OrdersEdit.vue'),
          props: (route) => ({
            id: route.params.id,
          }),
          beforeEnter: (to, _from, next) => {
            if (to.params.id) return next();
            throw Error('Missing `id` parameter');
          },
        },
      ],
    },
    {
      path: 'users',
      name: 'users-list',
      component: () => import(/* webpackChunkName: "Users" */ '@/views/Dashboard/Users/UsersList.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: 'docs',
      component: () => import(/* webpackChunkName: "Docs" */ '@/views/Dashboard/Docs/index.vue'),
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: ':doc',
          name: 'docs-md',
          component: () => import(/* webpackChunkName: "Docs" */ '@/views/Dashboard/Docs/Markdown.vue'),
          beforeEnter: (to, from, next) => {
            if (to.query.popped) {
              to.meta.layout = 'full-screen';
            }
            next();
          },
          props: (route) => {
            const p = { popped: '', doc: route.params.doc };
            if (route.query.popped) p.popped = 'yes';
            return p;
          },
        },
      ],
    },
  ],
}];

export default config;
