import FaunaStream from '~/fauna/faunaStream'
const faunadb = require('faunadb')
const q = faunadb.query

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
  async getUser({ dispatch, commit }, { username, password }) {
    commit('app/setLoading', true, { root: true })
    const url = new URL('/.netlify/functions/getUser', this.$config.baseURL)
    let response = await fetch(url, {
      body: JSON.stringify({
        username,
        password,
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
    // Compose actions. getUser -> dispatches getGroups
    await dispatch('getGroups')
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
    commit('app/setLoading', false, { root: true })
    // Onboard if no active groups
    if (rootGetters['user/activeGroupCount'] === 0) {
      commit('app/setOnboardStep', 1, { root: true })
    }
  },
  // For students, stream user document
  openStream({ state, commit, dispatch }, { id }) {
    const keyedClient = new faunadb.Client({
      secret: state.secret,
    })
    // Create a Fauna stream object
    const fso = new FaunaStream(
      keyedClient,
      q.Ref(q.Collection('User'), id),
      commit,
      dispatch
    )
    fso.initStream()
    // TODO Destroy on logout
  },
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
    console.log(`createGroup adding..`, response)
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
    // Update local data
    commit('setNameAndCourse', {
      id: getters.activeGroup.id,
      name: groupName,
      course: await response.json(),
    })
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
    // Commit mutation to update num_students on new group
    // so, for example, counts are correct on classes.vue
    commit('user/updateNumStudents', studentIds.length)
  },
}
export default actions
