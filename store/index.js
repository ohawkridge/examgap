export const actions = {
  // only called on main store
  // ∴ dispatch to other modules
  nuxtServerInit({ dispatch }, context) {
    return Promise.all([dispatch('groups/nuxtServerInit', context)])
  },
}
