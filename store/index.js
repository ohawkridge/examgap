export const actions = {
  // nuxtServerInit only called on main store
  // so dispatch out to other store modules
  nuxtServerInit({ dispatch }, context) {
    return Promise.all([dispatch('user/nuxtServerInit', context)])
  },
}
