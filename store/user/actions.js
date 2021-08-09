const actions = {
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
    // For students only, get revision topics
    if (!state.teacher) {
      const courseId = getters.activeGroup.course.id
      await dispatch('topics/getTopics', courseId, { root: true })
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
    // Onboard if no active groups
    if (rootGetters['user/activeGroupCount'] === 0) {
      commit('app/setOnboardStep', 1, { root: true })
    }
  },
  // TODO Won't need?
  // For students, get new streamed assignment
  async getAssignment({ commit, rootState }, assignmentId) {
    const url = new URL(
      '/.netlify/functions/getNewAssignment',
      this.$config.baseURL
    )
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        assignmentId,
      }),
      method: 'POST',
    })
    response = await response.json()
    commit('newAssignment', response, { root: true })
    commit('snackbar/showSnack', { msg: 'New assignment' }, { root: true })
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
    commit('setActiveGroupIndex', -1)
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
    // Update local data
    commit('setNameAndCourse', {
      id: getters.activeGroup.id,
      name: groupName,
      course: await response.json(),
    })
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
    commit('setCount', {
      groupId,
      numCopied: studentIds.length,
    })
  },
}
export default actions
