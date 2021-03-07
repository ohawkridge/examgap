export const state = () => ({
  groups: [],
  tab: true,
  activeGroupIndex: 0,
  revisionTopics: [],
  currentRevisionTopic: {},
})

export const getters = {
  activeGroup: (state) => {
    return state.groups[state.activeGroupIndex]
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
  async archiveGroup({ commit, rootState, state }) {
    try {
      const url = new URL(
        '/.netlify/functions/archiveClass',
        this.$config.baseURL
      )
      const response = await fetch(url, {
        body: JSON.stringify({
          secret: rootState.user.secret,
          groupId: state.group.id,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error archiving class ${response.status}`)
      }
      // Update local data
      commit('setArchived', state.group.id)
    } catch (e) {
      console.error(`Error archiving group`, e)
    }
  },
  async updateGroup({ commit, rootState, getters }, { courseId, groupName }) {
    try {
      const url = new URL(
        '/.netlify/functions/updateGroup',
        this.$config.baseURL
      )
      const response = await fetch(url, {
        body: JSON.stringify({
          secret: rootState.user.secret,
          groupId: getters.activeGroup.id,
          courseId,
          groupName,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error updating class ${response.status}`)
      }
      // Update local data
      commit('setNameAndCourse', {
        id: getters.activeGroup.id,
        name: groupName,
        course: await response.json(),
      })
    } catch (e) {
      console.error(e)
    }
  },
}

export const mutations = {
  // N.B. Use slice in mutations for reactivity
  setGroups(state, groups) {
    state.groups = groups
  },
  setTab(state, val) {
    state.tab = val
  },
  setNameAndCourse(state, { id, name, course }) {
    for (let i = 0; i < state.groups.length; i++) {
      if (state.groups[i].id === id) {
        state.groups[i].name = name
        state.groups[i].course = { ...course }
      }
    }
  },
  setArchived(state, groupId) {
    for (let i = 0; i < state.groups.length; i++) {
      if (state.groups[i].id === groupId) {
        state.groups[i].active = false
      }
    }
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
