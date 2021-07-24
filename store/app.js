export const state = () => ({
  tab: true, // Home or Archive tab? (teacher only)
  onboardStep: 0, // Don't onboard
  loading: false, // Global loading state
  database: 'prod', // Which database?
})

export const mutations = {
  setTab(state, val) {
    state.tab = val
  },
  setDatabase(state, database) {
    state.database = database
  },
  setOnboardStep(state, step) {
    state.onboardStep = step
  },
  setLoading(state, loading) {
    state.loading = loading
  },
}
