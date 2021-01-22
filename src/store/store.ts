import pathify from '@/plugins/vuex-pathify';
import vuexPersist from '@/plugins/vuex-persist';
import Vue from 'vue';
import Vuex from 'vuex';
import { ORMDatabase } from 'vuex-orm-decorators';
import * as modules from './modules';
import { IAppState } from './modules';

const isProduction = (process.env.NODE_ENV === 'production');

Vue.use(Vuex);

const storeOptions = {
  plugins: [
    pathify.plugin,
    ORMDatabase.install({}),
    vuexPersist.plugin,
  ],
  strict: !isProduction,
  state: {},
  mutations: {
    RESTORE_MUTATION: vuexPersist.RESTORE_MUTATION,
  },
  actions: {},
  modules: {
    context: modules.contextModule,
    layout: modules.layoutModule,
    soundcloud: modules.soundcloudModule,
  },
};

export default new Vuex.Store<IAppState>(storeOptions as any);
