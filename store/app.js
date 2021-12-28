const getDefaultState = () => ({
  tab: null,
  onboardStep: 0,
  loading: false,
  pageTitle: 'Home',
  navbar: null,
})

// eslint-disable-next-line no-unused-vars
const state = getDefaultState()

const actions = {
  resetState({ commit }) {
    commit('resetState')
  },
}

const mutations = {
  setTab(state, tab) {
    state.tab = tab
  },
  setOnboardStep(state, step) {
    state.onboardStep = step
  },
  setPageTitle(state, title) {
    state.pageTitle = title
  },
  setNav(state, val) {
    state.navbar = val
  },
  resetState(state) {
    Object.assign(state, getDefaultState())
  },
}

export default {
  state: getDefaultState,
  mutations,
  actions,
}
