import VuexPersistence from 'vuex-persist';

const isProduction = (process.env.NODE_ENV === 'production');

const vuexPersistOptions = {
  strictMode: (!isProduction),
  storage: window.localStorage as Storage,
  modules: [
    'entities',
    'context',
  ],
};

export default new VuexPersistence(vuexPersistOptions);
