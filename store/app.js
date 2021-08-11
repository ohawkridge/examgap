export const state = () => ({
  tab: null, // Home or Archive tab? (teacher only)
  onboardStep: 0, // Don't onboard
  loading: false, // Global loading state
  pageTitle: 'Classes', // Global page title
})

export const mutations = {
  setTab(state, val) {
    state.tab = val
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
}
