import { make } from 'vuex-pathify';
import { VuetifyThemeVariant } from 'vuetify/types/services/theme.d';
import Vuetify from '@/plugins/vuetify';
import { ActionContext } from 'vuex';
import { merge } from 'lodash';

export interface IContextState {
  /**
   * UI theme options and values
   */
  ui: {
    /**
     * Is the UI theme in dark mode?
     */
    dark: boolean;
    /**
     * Vuetify themes object (colors, etc.)
     */
    theme: VuetifyThemeVariant;
    /**
     * Whether the UI is currently transitioning or not
     */
    transitioning: boolean;
  }

  /**
   * Overlay and page-loading indicator
   */
  overlay: {
    /**
     * Overlay is visible
     */
    visible: boolean;
  };
}

const state: IContextState = {
  ui: {
    dark: false,
    theme: Vuetify.framework.theme.themes.light,
    transitioning: false,
  },
  overlay: {
    visible: false,
  },
};

const mutations = {
  ...make.mutations(state),
  SET_THEME: (contextState: IContextState, payload: IContextState['ui']['theme']) => {
    const { ui } = contextState;
    Object.keys(payload).forEach((color) => {
      ui.theme[color] = payload[color];
    });
    Vuetify.framework.theme.themes.light = ui.theme;
  },
  SET_TRANSITIONING: (contextState: IContextState, payload: IContextState['ui']['transitioning']) => {
    const { ui } = contextState;
    ui.transitioning = payload;
  },
};

const getters = {
  ...make.getters(state),
  theme: (contextState: IContextState) => contextState.ui.theme,
};

const actions = {
  ...make.actions(state),
  setTheme: (context: ActionContext<IContextState, any>, payload: IContextState['ui']['theme']) => {
    const theme = merge(context.state.ui.theme, payload);
    context.commit('SET_THEME', theme);
  },
  setTransitioning: (context: ActionContext<IContextState, any>) => {
    context.commit('SET_TRANSITIONING', true);
    setTimeout(() => {
      context.commit('SET_TRANSITIONING', false);
    }, 1000);
  },
};

export const module = {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};

export default module;
