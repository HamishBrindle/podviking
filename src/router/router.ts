import { UserService } from '@/services/UserService';
import store from '@/store';
// import store from '@/store';
import { Utilities } from '@/tools/Utilities';
import Home from '@/views/Home/Home.vue';
import Vue from 'vue';
import VueRouter, { Route, RouteConfig } from 'vue-router';
// import { call } from 'vuex-pathify';
import { dashboard, misc } from './routes';

Vue.use(VueRouter);

const userService = UserService.getInstance();

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      theme: { primary: '#456EF5' },
    },
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import(/* webpackChunkName: "Shop" */ '@/views/Shop/Shop.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "About" */ '@/views/About/About.vue'),
    meta: {
      theme: { primary: '#F7824D' },
    },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import(/* webpackChunkName: "Contact" */ '@/views/Contact/Contact.vue'),
  },
  {
    path: '/licensing',
    name: 'licensing',
    component: () => import(/* webpackChunkName: "Licensing" */ '@/views/Licensing/Licensing.vue'),
  },
  ...dashboard,
  ...misc,
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

/**
 * Returns true if user is authenticated.
 *
 * @returns {boolean}
 */
function isAuthenticated(): boolean {
  return !!userService.getActive()?.authenticationToken;
}

/**
 * Returns true if given route requires authentication.
 */
function isAuthenticationRequired(route: Route): boolean {
  return route.matched.some((record) => record.meta.requiresAuth);
}

router.beforeEach((to, from, next) => {
  if (Utilities.isUsingIEBrowser() && to.name !== 'unsupported-browser') {
    return next({
      name: 'unsupported-browser',
    });
  }

  if (isAuthenticationRequired(to)) {
    // not authenticated; go to login
    if (!isAuthenticated()) {
      const route = {
        name: 'login',
        params: to.params,
        query: {
          redirect: to.path,
        },
      };
      return next(route);
    }
  }

  console.log('transitioning', store.state.context.ui.transitioning);
  store.dispatch('context/setTransitioning', true);

  return next();
});

export default router;
