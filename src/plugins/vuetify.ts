import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        primary: '#456EF5',
        secondary: '#00FF66',
        accent: '#FF6666',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        white: '#FFFFFF',
        black: '#333333',
      },
      dark: {
        primary: '#456EF5',
        secondary: '#00FF66',
        accent: '#FF6666',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        white: '#FFFFFF',
        black: '#222222',
      },
    },
  },
});
