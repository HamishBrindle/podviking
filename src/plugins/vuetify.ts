import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/dist/vuetify.min.css';
import { VuetifyThemeVariant } from 'vuetify/types/services/theme.d';

Vue.use(Vuetify);

export type PartialVuetifyThemes = {
  light?: Partial<VuetifyThemeVariant>,
  dark?: Partial<VuetifyThemeVariant>
}

/**
 * Themeing alias'
 */
export const palette = {
  ultramarineBlue: '#456EF5',
  springGreen: '#00FF66',
  bittersweet: '#FF6666',
  white: '#FFFFFF',
  quickSilver: '#A3A3A3',
  jet: '#333333',
};

/**
 * Starting theme values
 */
export const rootTheme = {
  primary: palette.ultramarineBlue,
  secondary: palette.springGreen,
  accent: palette.bittersweet,
  white: palette.white,
  grey: palette.quickSilver,
  black: palette.jet,
  background: palette.white,
  error: '#FF5252',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107',
};

const options = {
  theme: {
    options: { customProperties: true },
    themes: {
      light: rootTheme,
      dark: rootTheme,
    },
  },
};

export default new Vuetify(options);
