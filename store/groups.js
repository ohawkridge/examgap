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
  groupById: (state) => (id) => {
    return state.groups.find((group) => group.id === id)
  },
  groupByAssignmentId: (state) => (assignmentId) => {
    // Prevent error when groups is reset on logout
    if (state.groups) {
      for (const group of state.user.groups) {
        for (const assignment of group.assignments) {
          if (assignment.id === assignmentId) {
            return group
          }
        }
      }
    }
  },
}

export const actions = {
  async getGroups({ commit, rootState }) {
    try {
      // TODO Use environment variable
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
  logout(state) {
    state.groups = []
    state.activeGroupIndex = 0
  },
}
