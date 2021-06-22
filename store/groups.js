export const state = () => ({
  groups: [],
  tab: true,
  activeGroupIndex: 0,
  revisionTopics: [],
  currentRevisionTopic: {},
  loading: false,
})

export const getters = {
  activeGroup: (state) => {
    return state.groups[state.activeGroupIndex]
  },
  // N.B. rootState is 3rd arg (can't descructure)
  activeGroupCount: (state, getters, rootState) => {
    return state.groups.filter(
      (group) => group.active || !rootState.user.teacher
    ).length
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
  async getRevisionTopics({ commit, getters, rootState }) {
    if (getters.activeGroup !== undefined) {
      commit('setLoading', true)
      try {
        const url = new URL(
          '/.netlify/functions/getTopics',
          this.$config.baseURL
        )
        const response = await fetch(url, {
          body: JSON.stringify({
            secret: rootState.user.secret,
            courseId: getters.activeGroup.course.id,
          }),
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(`Error fetching revision topics ${response.status}`)
        }
        commit('setRevisionTopics', await response.json())
      } catch (e) {
        console.error(e)
      } finally {
        commit('setLoading', false)
      }
    }
  },
  async archiveGroup({ commit, rootState, getters }) {
    try {
      const url = new URL(
        '/.netlify/functions/archiveClass',
        this.$config.baseURL
      )
      const response = await fetch(url, {
        body: JSON.stringify({
          secret: rootState.user.secret,
          groupId: getters.activeGroup.id,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error archiving class ${response.status}`)
      }
      // Update local data
      commit('setArchived')
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
  // N.B. Use slice in mutations for reactivity !!
  setLoading(state, loading) {
    state.loading = loading
  },
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
  setArchived(state) {
    state.groups[state.activeGroupIndex].active = false
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
    // CreateClass.vue sends -1 as active group
    state.activeGroupIndex = i === -1 ? state.groups.length - 1 : i
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
  // Called by _students.vue (in case new students have joined)
  updateStudentCount(state, n) {
    state.groups[state.activeGroupIndex].num_students = n
  },
  // Called after manually adding a student
  incrementStudentCount(state) {
    state.groups[state.activeGroupIndex].num_students++
  },
  // Teacher creates a new assignment
  addAssignment(state, assignment) {
    // Add assignment to front of assignments array
    state.groups[state.activeGroupIndex].assignments.unshift({
      dateDue: assignment.data.dateDue,
      id: assignment.ref['@ref'].id,
      name: assignment.data.name,
      start: assignment.data.start,
    })
  },
  deleteAssignment(state, { groupId, assignmentId }) {
    const groupIndex = state.groups.findIndex((g) => g.id === groupId)
    const assignments = state.groups[groupIndex].assignments
    // Let's prefer splice for now to maintain reactivity
    for (let i = 0; i < assignments.length; i++) {
      if (assignments[i].id === assignmentId) {
        assignments.splice(i, 1)
      }
    }
  },
  // Student gets new assignment in doc stream
  newAssignment(state, assignment) {
    // Find index of group
    // (Might not be current active group!)
    const groupIndex = state.groups.findIndex((g) => g.id === assignment.group)
    // Add assignment to front of assignments array
    state.groups[groupIndex].assignments.unshift(assignment)
  },
  logout(state) {
    state.groups = []
    state.tab = true
    state.activeGroupIndex = 0
    state.revisionTopics = []
    state.currentRevisionTopic = {}
    state.loading = false
  },
}
