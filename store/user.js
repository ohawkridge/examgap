const getDefaultState = () => ({
  // Common properties
  id: '',
  username: '',
  secret: '',
  teacher: false,
  groups: [],
  archivedGroups: [],
  activeGroupId: '',
  subscriptionDays: 'N/A', // Calculated in Fauna
  // Teacher properties
  school: 'N/A',
  subscribed: false,
  subscriptionExpires: '',
  // Student properties
  examMode: false,
  reviseExamMode: false,
  quote: '',
})

// eslint-disable-next-line no-unused-vars
const state = getDefaultState()

const getters = {
  expires: (state) => {
    const d = new Date(state.subscriptionExpires['@ts'].substring(0, 10))
    return d.toString().substring(0, 15)
  },
  activeGroup: (state) => {
    const found = state.groups.find((g) => g.id === state.activeGroupId)
    // Group must be archived
    if (!found) {
      return state.archivedGroups.find((g) => g.id === state.activeGroupId)
    }
    return found
  },
  // TheCopyStudentDialog.vue
  // Return a list of the user's groups formatted for v-select
  selectGroups: (state, getters) => {
    if (getters.activeGroup === undefined) {
      return []
    }
    const groups = state.groups.map((group) => {
      const obj = {
        text: group.name,
        value: group.id,
      }
      return obj
    })
    // Filter out the current group
    return groups.filter((g) => g.value !== getters.activeGroup.id)
  },
}

const actions = {
  async getQuote({ state, commit, rootState }) {
    if (!state.teacher && state.quote === '') {
      const url = new URL('/.netlify/functions/getQuote', this.$config.baseURL)
      const response = await fetch(url, {
        body: JSON.stringify({
          secret: rootState.user.secret,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Error getting quote')
      }
      commit('setQuote', await response.json())
    }
  },
  async getArchived({ commit, rootState }) {
    const url = new URL(
      '/.netlify/functions/getArchivedClasses',
      this.$config.baseURL
    )
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Error getting archived classes')
    }
    response = await response.json()
    commit('setArchivedGroups', response)
  },
  async getUser({ commit }, { username, password }) {
    commit('app/setLoading', true, { root: true })
    const url = new URL('/.netlify/functions/getUser', this.$config.baseURL)
    let response = await fetch(url, {
      body: JSON.stringify({
        username,
        password,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Error getting user')
    }
    response = await response.json()
    commit('setUser', response)
    commit('app/setLoading', false, { root: true })
  },
  async archiveGroup({ commit, rootState, getters }) {
    const group = getters.activeGroup
    const url = new URL(
      '/.netlify/functions/archiveClass',
      this.$config.baseURL
    )
    await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        groupId: group.id,
      }),
      method: 'POST',
    })
    commit('setArchived', group)
  },
  async restoreGroup({ commit, rootState, getters }) {
    const url = new URL(
      '/.netlify/functions/restoreClass',
      this.$config.baseURL
    )
    await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        groupId: getters.activeGroup.id,
      }),
      method: 'POST',
    })
    commit('setRestored')
  },
  async joinClass({ commit, rootState }, code) {
    const url = new URL('/.netlify/functions/joinClass', this.$config.baseURL)
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        code,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Error joining  class')
    }
    response = await response.json()
    // Add the returned group to groups array
    console.debug(response)
  },
  async createGroup({ commit, rootState }, { courseId, groupName }) {
    const url = new URL('/.netlify/functions/createGroup', this.$config.baseURL)
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        groupName,
        courseId,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(
        `Error creating class \n ${response.statusText} (${response.status})`
      )
    }
    response = await response.json()
    // Update local store
    // (mutations.js will find the actual index of new group)
    commit('addGroup', response)
    commit('setActiveGroupId', -1)
    // Progress onboarding
    commit('app/setOnboardStep', 2, { root: true })
  },
  async updateGroup({ commit, rootState, getters }, { courseId, groupName }) {
    const url = new URL('/.netlify/functions/updateGroup', this.$config.baseURL)
    const group = getters.activeGroup
    const response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        groupId: group.id,
        courseId,
        groupName,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error updating group ${response.status}`)
    }
    // Course object including e.g., board, RAG etc.
    const course = await response.json()
    commit('setNameAndCourse', { group, groupName, course })
    // Update page title
    commit('app/setPageTitle', groupName, { root: true })
  },
  async createAssignment({ commit, getters }, obj) {
    const url = new URL(
      '/.netlify/functions/createAssignment',
      this.$config.baseURL
    )
    let newAssObj = await fetch(url, {
      body: JSON.stringify(obj),
      method: 'POST',
    })
    if (!newAssObj.ok) {
      throw new Error(`Error creating assignment ${newAssObj.status}`)
    }
    newAssObj = await newAssObj.json()
    commit('addAssignment', { newAssObj, group: getters.activeGroup })
  },
  async deleteAssignment({ commit, rootState, getters }, assignmentId) {
    const url = new URL(
      '/.netlify/functions/deleteAssignment',
      this.$config.baseURL
    )
    const response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        assignmentId,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error deleting assignment ${response.status}`)
    }
    // Update local data
    const obj = { group: getters.activeGroup, assignmentId }
    commit('deleteAssignment', obj)
  },
  // Copy student(s) into another group by
  // creating new mappings in GroupStudent
  async copyStudents({ commit, rootState, getters }, { studentIds, groupId }) {
    const url = new URL(
      '/.netlify/functions/createGroupStudent',
      this.$config.baseURL
    )
    const response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        studentIds,
        groupId,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(
        `Error copying students \n ${response.statusText} (${response.status})`
      )
    }
    // Update count for group (currentActiveGroup)
    commit('group/setCount', {
      group: getters.activeGroup,
      n: studentIds.length,
    })
  },
  resetState({ commit }) {
    commit('resetState')
  },
}

const mutations = {
  setUser(state, data) {
    // Common properties
    state.id = data.id
    state.username = data.username
    state.secret = data.secret
    state.teacher = data.teacher
    state.groups = data.groups
    // Teacher properties
    if (data.teacher) {
      state.subscriptionDays = data.subscriptionDays
      state.school = data.school
      state.subscribed = data.subscribed
      state.subscriptionExpires = data.subscriptionExpires
    } else {
      // Student properties
      state.examMode = data.examMode
    }
  },
  setArchive(state, groups) {
    state.archivedGroups = groups
  },
  setActiveGroupId(state, id) {
    // When a new class is created, TheCreateClassDialog sends -1
    // If so, set the most recent group (last in array) as active
    if (id === -1) {
      id = state.groups[state.groups.length - 1].id
    }
    state.activeGroupId = id
  },
  // Update count of students in class
  // (E.g., if student added/copied/removed)
  setCount(state, { group, n }) {
    group.count = n
  },
  setGroupName(state, { group, name }) {
    group.name = name
  },
  addGroup(state, group) {
    state.groups.push(group)
  },
  setQuote(state, quote) {
    state.quote = quote
  },
  setExamMode(state, val) {
    state.examMode = val
  },
  setRevisionExamMode(state, val) {
    state.reviseExamMode = val
  },
  addAssignment(state, { newAssObj, group }) {
    // Add assignment to *front* of assignments array for group
    group.assignments.unshift({ ...newAssObj })
  },
  deleteAssignment(state, { group, assignmentId }) {
    const i = group.assignments.findIndex((a) => a.id === assignmentId)
    group.assignments.splice(i, 1)
  },
  setNameAndCourse(state, { group, groupName, course }) {
    // Update active group's properties
    group.name = groupName
    group.course = { ...course }
  },
  setArchivedGroups(state, groups) {
    state.archivedGroups = groups
  },
  setArchived(state) {
    // Find group in groups array
    const i = state.groups.findIndex((g) => g.id === state.activeGroupId)
    // Add a copy to archive
    const temp = Object.assign({}, state.groups[i])
    temp.active = false
    state.archivedGroups.push(temp)
    // Now we can safely remove from groups
    state.groups.splice(i, 1)
  },
  setRestored(state) {
    // Find group in archive
    const i = state.archivedGroups.findIndex(
      (g) => g.id === state.activeGroupId
    )
    // Add a copy to current active array
    const temp = Object.assign({}, state.archivedGroups[i])
    temp.active = true
    state.groups.push(temp)
    // Remove from archived array
    state.archivedGroups.splice(i, 1)
  },
  resetState(state) {
    Object.assign(state, getDefaultState())
  },
}

export default { state: getDefaultState, getters, actions, mutations }
