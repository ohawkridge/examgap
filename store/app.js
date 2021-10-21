const getDefaultState = () => ({
  tab: null, // Home or Archive tab? (teacher only)
  groupTab: null, // Tab on _group.vue
  onboardStep: 0, // Don't onboard
  loading: false, // Global loading state
  pageTitle: 'Classes', // Global page title
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
  setGroupTab(state, val) {
    state.groupTab = val
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
