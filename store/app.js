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
    // console.log(
    //   '%c' + step,
    //   'padding:2px 4px;background-color:#ef7a85;color:white;border-radius:20px'
    // )
  },
  setLoading(state, loading) {
    state.loading = loading
  },
}
