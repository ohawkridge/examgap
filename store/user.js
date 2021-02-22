export const state = () => ({
  state: {
    user: {},
  },
})

export const actions = {
  // nuxtServerInit({ commit }, context) {
  //   //
  //   // commit('setUser', { username: 'Mr Fuckity' })
  // },
}

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
}
