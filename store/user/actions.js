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
  async getUser({ commit }, { username, password }) {
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
      throw new Error(`getUser\n ${response.statusText} (${response.status})`)
    }
    response = await response.json()
    commit('setUser', response)
  },
  // Get groups and assignments
  async getGroups({ rootState, commit }) {
    const url = new URL('/.netlify/functions/getGroups', this.$config.baseURL)
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`getGroups\n ${response.statusText} (${response.status})`)
    }
    response = await response.json()
    commit('setGroups', response)
    // Onboard teachers without groups
    // TODO
    // if (response.groups.length === 0) {
    //   commit('user/setOnboardStep', 1)
    // }
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
}
export default actions
