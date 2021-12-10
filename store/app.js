const getDefaultState = () => ({
  tab: null,
  upcoming: 0,
  onboardStep: 0,
  loading: false,
  pageTitle: 'Home',
  darkMode: false,
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
  setTab(state, val) {
    state.tab = val
  },
  setUpcoming(state, val) {
    state.upcoming = val
  },
  setOnboardStep(state, step) {
    state.onboardStep = step
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setPageTitle(state, title) {
    state.pageTitle = title
  },
  setDarkMode(state, mode) {
    state.darkMode = mode
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
