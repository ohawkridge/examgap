export const state = () => ({
  groups: [],
  group: {},
  activeGroupIndex: 0,
})

export const getters = {
  activeGroups: (state) => (active = true) => {
    return state.groups.filter((group) => group.active === active)
  },
  activeGroup: (state) => {
    return state.groups[state.activeGroupIndex]
  },
  groupById: (state) => (id) => {
    return state.groups.find((group) => group.id === id)
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
  // Remember !! This means create assignment will receive a group object
  setGroup(state, group) {
    state.group = group
  },
  updateGroupName(state, { id, name }) {
    for (let i = 0; i < state.groups.length; i++) {
      if (state.groups[i].id === id) {
        state.groups[i].name = name
      }
    }
  },
  logout(state) {
    state.groups = []
    state.group = {}
    state.activeGroupIndex = 0
  },
}
