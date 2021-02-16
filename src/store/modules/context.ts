import { make } from 'vuex-pathify';
import { VuetifyThemeVariant } from 'vuetify/types/services/theme.d';
import Vuetify, { rootTheme } from '@/plugins/vuetify';
import { ActionContext } from 'vuex';
import { merge } from 'lodash';
import variables from '@/styles/variables.scss';

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
     * Overlay is visible
     */
    overlayVisible: boolean;
  };

  transition: {
    /**
     * Default transition time between pages
     */
    transitionTime?: number,
    /**
     * Currently transitioning
     */
    isTransitioning: boolean,
    /**
     * Starting transition color
     */
    fromColor?: string,
    /**
     * Ending transition color
     */
    toColor?: string,
  },
}

const state: IContextState = {
  ui: {
    dark: false,
    overlayVisible: false,
  },
  transition: {
    transitionTime: parseInt(variables.transitionTime.replace('ms', ''), 10),
    isTransitioning: false,
    fromColor: 'transparent',
    toColor: 'transparent',
  },
};

const mutations = {
  ...make.mutations(state),
  SET_THEME: (contextState: IContextState, payload: Partial<VuetifyThemeVariant>) => {
    const theme: Partial<VuetifyThemeVariant> = {};
    const newTheme = merge(theme, rootTheme, payload);
    Object.keys(payload).forEach((color) => {
      newTheme[color] = payload[color];
    });
    Vuetify.framework.theme.themes.light = newTheme as VuetifyThemeVariant;
  },
  SET_TRANSITION: (contextState: IContextState, payload: IContextState['transition']) => {
    const { transition } = contextState;
    const mergedTransition = merge(transition, payload);
    transition.fromColor = mergedTransition.fromColor;
    transition.toColor = mergedTransition.toColor;
    transition.isTransitioning = mergedTransition.isTransitioning;
  },
};

const getters = {
  ...make.getters(state),
  theme: () => Vuetify.framework.theme.themes.light,
};

const actions = {
  ...make.actions(state),
  setTheme: (context: ActionContext<IContextState, any>, payload: Partial<VuetifyThemeVariant>) => {
    context.commit('SET_THEME', payload);
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
