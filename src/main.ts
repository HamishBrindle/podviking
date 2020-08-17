import Vue from 'vue';
import CustomVuex from '@/store';
import router from '@/router';
import vuetify from '@/plugins/vuetify';
import { AuthService } from '@/services/AuthService';
import App from '@/App.vue';
import 'reflect-metadata';
import '@/registerServiceWorker';
import { Auth } from '@/models/internal';
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
