export const state = () => ({
  groups: [],
  tab: true,
  group: {},
  activeGroupIndex: 0,
  revisionTopics: [],
  currentRevisionTopic: {},
})

export const getters = {
  activeGroups: (state, getters, rootState) => {
    if (rootState.user.teacher) {
      return state.groups.filter((group) => group.active === state.tab)
    } else {
      return state.groups
    }
  },
  activeGroup: (state) => {
    return state.groups[state.activeGroupIndex]
  },
  groupById: (state) => (id) => {
    return state.groups.find((group) => group.id === id)
  },
  groupsForSelect: (state) => {
    return state.groups.map((group) => {
      const obj = {
        text: group.name,
        value: group.id,
      }
      return obj
    })
  },
}

export const actions = {
  // Get student revision topics
  async getRevisionTopics({ commit, rootState, state }) {
    try {
      const url = new URL('/.netlify/functions/getTopics', this.$config.baseURL)
      const response = await fetch(url, {
        body: JSON.stringify({
          secret: rootState.user.secret,
          courseId: state.groups[state.activeGroupIndex].course.id,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error fetching revision topics ${response.status}`)
      }
      const data = await response.json()
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
  setTab(state, val) {
    state.tab = val
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
    state.revisionTopics = topics
  },
  setCurrentRevisionTopic(state, topic) {
    state.currentRevisionTopic = topic
  },
  setActiveGroupIndex(state, i) {
    state.activeGroupIndex = i
  },
  incrementTopicCount(state) {
    for (let i = 0; i < state.revisionTopics.length; i++) {
      if (state.revisionTopics[i].id === state.currentRevisionTopic.id) {
        state.revisionTopics[i].answered += 1
      }
    }
  },
  addGroup(state, group) {
    state.groups.push(group)
  },
  incrementStudentCount(state, groupId) {
    for (let i = 0; i < state.groups.length; i++) {
      if (state.groups[i].id === groupId) {
        state.groups[i].num_students += 1
      }
    }
  },
  logout(state) {
    state.groups = []
    state.tab = true
    state.group = {}
    state.activeGroupIndex = 0
    state.revisionTopics = []
    state.currentRevisionTopic = {}
  },
}
