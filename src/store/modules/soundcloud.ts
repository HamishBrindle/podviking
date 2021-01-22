import { make } from 'vuex-pathify';

export interface ISoundcloudState {
  song: string;
}

const state = {
  player: null,
};

const getters = {
  ...make.getters(state),
};

const mutations = {
  ...make.mutations(state),
};

const actions = {
  ...make.actions(state),
  // setVolume (_context: any, volume: number) {},
};

// export store
export const module = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default module;
