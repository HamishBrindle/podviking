import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/dist/vuetify.min.css';
import { VuetifyThemeVariant } from 'vuetify/types/services/theme.d';

Vue.use(Vuetify);

export type PartialVuetifyThemes = {
  light?: Partial<VuetifyThemeVariant>,
  dark?: Partial<VuetifyThemeVariant>
}

export const options = {
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
        grey: '#A3A3A3',
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
        grey: '#A3A3A3',
        black: '#222222',
      },
    },
  },
};

// Vue.use({
//   install(_Vue) {
//     _Vue.mixin({
//       mounted() {
//         const that = (this as any);
//         const themes = that.$themes;

//         console.log('themes :>> ', themes);

//         if (themes) {
//           Object.keys(themes.light).forEach((color) => {
//             if (!that.$vuetify.theme.themes.light[color]) return;
//             that.$vuetify.theme.themes.light[color] = themes.light[color];
//           });
//         }
//       },
//     });
//   },
// });

export default new Vuetify(options);
