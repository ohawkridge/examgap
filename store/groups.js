export const state = () => ({
  groups: [],
})

export const getters = {
  activeGroups: (state) => (active = true) =>
    state.groups.filter((group) => group.active === active),
}

export const actions = {
  async getGroups({ commit, rootState }) {
    try {
      const response = await fetch('/.netlify/functions/getGroups', {
        body: JSON.stringify({
          secret: rootState.user.secret,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error fetching groups ${response.status}`)
      } else {
        // Call mutation to update state
        const groups = await response.json()
        commit('setGroups', groups.groups)
      }
    } catch (e) {
      console.error(e)
    }
  },
}

export const mutations = {
  setGroups(state, groups) {
    state.groups = groups
  },
}
