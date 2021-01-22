import 'reflect-metadata';
import '@/registerServiceWorker';
import '@/styles/main.scss';
import { AuthService } from '@/services/AuthService';
import AppComponent from '@/App.vue';
import ErrorComponent from '@/views/Error.vue';
import store from '@/store';
import router from '@/router';
import Vue, { Component } from 'vue';
import vuetify from '@/plugins/vuetify';
import { Logger } from '@/tools/Logger';

Vue.config.productionTip = false;

const logger = new Logger({ context: 'ApplicationBoostrap' });
const authService = AuthService.getInstance();

async function start() {
  let entryComponent: Component = AppComponent;

  try {
    Vue.prototype.$ability = authService.defineAbility();
  } catch (error) {
    logger.error(error);
    entryComponent = ErrorComponent;
  }

  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(entryComponent),
  }).$mount('#app');
}

start();
