export const state = () => ({
  groups: [],
  group: {},
  activeGroupIndex: 0,
  revisionTopics: [],
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
  // Get student revision topics
  async getRevisionTopics({ commit, state }, courseId) {
    try {
      const url = new URL(
        '/.netlify/functions/getTopics',
        'http://localhost:8888'
      )
      const response = await fetch(url, {
        body: JSON.stringify({
          secret: state.secret,
          courseId,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error fetching revision topics ${response.status}`)
      }
      const data = await response.json()
      console.dir(data)
      commit('setRevisionTopics', data)
    } catch (e) {
      console.error(e)
    }
  },
}

export const mutations = {
  setGroups(state, groups) {
    state.groups = groups
  },
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
  setRevisionTopics(state, topics) {
    state.topics = topics
  },
  logout(state) {
    state.groups = []
    state.group = {}
    state.activeGroupIndex = 0
    state.revisionTopics = []
  },
}
