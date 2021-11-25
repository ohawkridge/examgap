const getDefaultState = () => ({
  tab: null, // Assignments/revision on home.vue (student)
  upcoming: 0,
  groupTab: null, // Tab on _group.vue
  onboardStep: 0, // Don't onboard
  loading: false, // Global loading state
  pageTitle: 'Welcome back', // Global page title
})

// eslint-disable-next-line no-unused-vars
const state = getDefaultState()

const actions = {
  resetState({ commit }) {
    commit('resetState')
  },
}

const mutations = {
  setGroupTab(state, val) {
    state.groupTab = val
  },
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
  resetState(state) {
    Object.assign(state, getDefaultState())
  },
}

export default {
  state: getDefaultState,
  mutations,
  actions,
}
