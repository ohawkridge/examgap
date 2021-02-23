export const state = () => ({
  groups: [],
  activeGroupIndex: 0,
})

export const getters = {
  activeGroups: (state) => (active = true) =>
    state.groups.filter((group) => group.active === active),
  activeGroup: (state) => {
    return state.groups[state.activeGroupIndex]
  },
}

export const actions = {
  async getGroups({ commit, rootState }) {
    console.log('getGroups')
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
        console.log(`committing...`)
        console.log(groups)
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
