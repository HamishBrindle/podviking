import { make } from 'vuex-pathify';

export interface ILayoutState {
  totalHeight: number | string;
  appBarHeight: number | string;
  reportHeight: number | string;
}

const state: ILayoutState = {
  totalHeight: 0,
  appBarHeight: 0,
  reportHeight: 0,
};

const mutations = make.mutations(state);
const getters = make.getters(state);
const actions = make.actions(state);

export const module = {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};

export default module;
