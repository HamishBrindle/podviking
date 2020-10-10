import App from '@/App.vue';
import { Auth } from '@/models/internal';
import vuetify from '@/plugins/vuetify';
import '@/registerServiceWorker';
import router from '@/router';
import { AuthService } from '@/services/AuthService';
import CustomVuex from '@/store';
import 'reflect-metadata';
import Vue from 'vue';
import { UserService } from './services';

Vue.config.productionTip = false;

const authService = AuthService.getInstance();
const userService = UserService.getInstance();

async function start() {
  try {
    Vue.use(CustomVuex);

    const store = await CustomVuex.init();
    const user = userService.getActive();
    const auth = (user?.auth) ? user.auth : new Auth();

    Vue.prototype.$ability = authService.defineAbility(auth);

    new Vue({
      router,
      store,
      vuetify,
      render: (h) => h(App),
    }).$mount('#app');
  } catch (error) {
    console.error('Unable to start application:', error);
  }
}

start();
