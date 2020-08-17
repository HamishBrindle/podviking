import Vue from 'vue';
import VueRouter, { RouteConfig, Route } from 'vue-router';
import Home from '@/views/Home.vue';
import { UserService } from '@/services';
import util from '@/tools/Utilities';
import { dashboard, docs, misc } from './routes';

Vue.use(VueRouter);

const userService = UserService.getInstance();

const routes: Array<RouteConfig> = [
  // Primary Routes
  {
    path: '/',
    component: Home,
    meta: {
      layout: 'storefront',
    },
  },

  // Dashboard Routes
  ...dashboard,

  // Documentation Routes
  ...docs,

  // Misc Routes
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
  return !!userService.getActive()?.authentication_token;
}

/**
 * Returns true if given route requires authentication.
 */
function isAuthenticationRequired(route: Route): boolean {
  return route.matched.some((record) => record.meta.requiresAuth);
}

router.beforeEach((to, from, next) => {
  if (util.isUsingIEBrowser() && to.name !== 'unsupported-browser') {
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

  return next();
});

export default router;
