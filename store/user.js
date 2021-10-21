const getDefaultState = () => ({
  // Common properties
  id: '',
  username: '',
  secret: '',
  teacher: false,
  groups: [],
  activeGroupId: '',
  subscriptionDays: 'N/A', // Calculated in Fauna
  // Teacher properties
  school: 'N/A',
  subscribed: false,
  subscriptionExpires: '',
  // Student properties
  examMode: false,
  reviseExamMode: false,
  quote: 'Experiment, fail, learn, repeat.—Anonymous',
})

// eslint-disable-next-line no-unused-vars
const state = getDefaultState()

const getters = {
  activeGroup: (state) => {
    const i = state.groups.findIndex((g) => g.id === state.activeGroupId)
    return state.groups[i]
  },
  activeGroupCount: (state) => {
    return state.groups.filter((group) => group.active).length
  },
  // Filter out post-dated assignments
  assignments: (state, getters) => {
    if (getters.activeGroup === undefined) return []
    return getters.activeGroup.assignments.filter(
      (a) => a.start === 'N/A' || new Date(a.start) <= new Date()
    )
  },
  // Return a list of the user's groups formatted for v-select
  selectGroups: (state, getters) => {
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
  resetState({ commit, state }) {
    commit('resetState')
  },
  async getQuote({ commit, rootState }) {
    const url = new URL('/.netlify/functions/getQuote', this.$config.baseURL)
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`getQuote\n ${response.statusText} (${response.status})`)
    }
    response = await response.json()
    commit('setQuote', response)
  },
  // Try to obtain user document with credentials
  async getUser(
    { state, getters, dispatch, commit },
    { username, password, database = 'prod' }
  ) {
    commit('app/setLoading', true, { root: true })
    const url = new URL('/.netlify/functions/getUser', this.$config.baseURL)
    let response = await fetch(url, {
      body: JSON.stringify({
        username,
        password,
        database,
      }),
      method: 'POST',
    })
    // N.B. Must throw error in order to catch in component
    if (!response.ok) {
      throw new Error(
        `Error getting user data \n ${response.statusText} (${response.status})`
      )
    }
    response = await response.json()
    commit('setUser', response)
    await dispatch('getGroups')
    // For students only, get revision topics and Quote of the Day
    if (!state.teacher) {
      const courseId = getters.activeGroup.course.id
      await dispatch('topics/getTopics', courseId, { root: true })
      await dispatch('getQuote')
    }
    commit('app/setLoading', false, { root: true })
  },
  // Get groups and assignments
  async getGroups({ rootState, commit, rootGetters }) {
    const url = new URL('/.netlify/functions/getGroups', this.$config.baseURL)
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        teacher: rootState.user.teacher,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`getGroups\n ${response.statusText} (${response.status})`)
    }
    response = await response.json()
    commit('setGroups', response)
    // By default, make student's first class active
    if (!rootState.user.teacher) {
      const id = rootState.user.groups[0].id
      commit('setActiveGroupId', id)
    }
    // Onboard if no active groups
    if (rootGetters['user/activeGroupCount'] === 0) {
      commit('app/setOnboardStep', 1, { root: true })
    }
  },
  async archiveGroup({ commit, rootState, getters }) {
    const url = new URL(
      '/.netlify/functions/archiveClass',
      this.$config.baseURL
    )
    await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        groupId: getters.activeGroup.id,
      }),
      method: 'POST',
    })
    commit('setArchived')
  },
  async createGroup({ commit, rootState, getters }, { courseId, groupName }) {
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
    // If on Archive, set back to Home
    commit('app/setTab', true, { root: true })
  },
  async updateGroup({ commit, rootState, getters }, { courseId, groupName }) {
    const url = new URL('/.netlify/functions/updateGroup', this.$config.baseURL)
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
      throw new Error(`Error updating group ${response.status}`)
    }
    // Change props on actual group object (locally)
    const obj = {
      name: groupName,
      course: await response.json(),
    }
    commit('setNameAndCourse', obj)
    commit('app/setPageTitle', groupName, { root: true })
  },
  async createAssignment({ commit }, obj) {
    const url = new URL(
      '/.netlify/functions/createAssignment',
      this.$config.baseURL
    )
    let response = await fetch(url, {
      body: JSON.stringify(obj),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error creating assignment ${response.status}`)
    }
    response = await response.json()
    // Clear any previously selected questions
    commit('topics/clearSelectedQuestions', null, { root: true })
    commit('addAssignment', response)
  },
  async deleteAssignment({ commit, rootState }, assignmentId) {
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
    commit('deleteAssignment', assignmentId)
  },
  // Copy student(s) into another group by
  // creating new mappings in GroupStudent
  async copyStudents({ commit, rootState }, { studentIds, groupId }) {
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
    // Commit mutation to update count on new group
    // so, for example, counts are correct on classes.vue
    commit('group/setCount', {
      groupId,
      count: studentIds.length,
    })
  },
}

const mutations = {
  setUser(state, data) {
    // Common properties
    state.id = data.id
    state.username = data.username
    state.secret = data.secret
    state.teacher = data.teacher
    // Teacher/student properties
    if (data.teacher) {
      state.subscriptionDays = data.subscriptionDays
      state.school = data.school
      state.subscribed = data.subscribed
      state.subscriptionExpires = data.subscriptionExpires
    } else {
      state.examMode = data.examMode
    }
  },
  setGroups(state, groups) {
    state.groups = groups
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
  setCount(state, count) {
    // Find the active group
    // (saves passing in groupId as an extra parameter)
    const i = state.groups.findIndex((g) => g.id === state.activeGroupId)
    // Update the count
    state.groups[i].count = count
  },
  setGroupName(state, name) {
    const i = state.groups.findIndex((g) => g.id === state.activeGroupId)
    state.groups[i].name = name
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
  addAssignment(state, assignment) {
    const i = state.groups.findIndex((g) => g.id === state.activeGroupId)
    // Add assignment to *front* of assignments array for group
    state.groups[i].assignments.unshift({
      dateDue: assignment.data.dateDue,
      id: assignment.ref['@ref'].id,
      name: assignment.data.name,
      start: assignment.data.start,
      num_questions: assignment.data.questions.length,
      live: true,
    })
  },
  deleteAssignment(state, assignmentId) {
    const i = state.groups.findIndex((g) => g.id === state.activeGroupId)
    const assignments = state.groups[i].assignments
    const j = assignments.findIndex((a) => a.id === assignmentId)
    assignments.splice(j, 1)
  },
  setNameAndCourse(state, { name, course }) {
    const i = state.groups.findIndex((g) => g.id === state.activeGroupId)
    state.groups[i].name = name
    state.groups[i].course = { ...course }
  },
  setArchived(state) {
    const i = state.groups.findIndex((g) => g.id === state.activeGroupId)
    state.groups[i].active = false
  },
  resetState(state) {
    Object.assign(state, getDefaultState())
  },
}

export default { state: getDefaultState, getters, actions, mutations }
