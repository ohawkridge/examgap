export const state = () => ({
  tab: true, // Home or Archive tab? (teacher only)
  onboardStep: 0, // Don't onboard
  loading: false, // Global loading state
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
}
