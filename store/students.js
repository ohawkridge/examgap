export const state = () => ({
  students: [], // _students.vue
})

export const actions = {
  async addStudents(
    { rootState, commit, rootGetters, dispatch },
    { usernames, groupId }
  ) {
    const url = new URL('/.netlify/functions/addStudents', this.$config.baseURL)
    const response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        usernames,
        groupId,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error adding students ${response.status}`)
    }
    // Update count on group
    const count = rootGetters['user/activeGroup'].count + usernames.length
    commit('user/setCount', { groupId, count }, { root: true })
    // Refetch student data
    // (too complicated to insert new students)
    await dispatch('getStudents')
    // Send welcome email *only if* username looks like an email address
    const url2 = new URL(
      '/.netlify/functions/sendEmailWelcomeStudent',
      this.$config.baseURL
    )
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    for (const username of usernames) {
      if (pattern.test(usernames)) {
        await fetch(url2, {
          method: 'POST',
          mode: 'cors',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: username }),
        })
      }
    }
  },
  async getStudents({ rootState, commit, rootGetters }) {
    const url = new URL('/.netlify/functions/getStudents', this.$config.baseURL)
    const groupId = rootGetters['user/activeGroup'].id
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        groupId,
        namesOnly: false,
      }),
      method: 'POST',
    })
    // N.B. Make sure this is *before* you call .json() !!
    if (!response.ok) {
      throw new Error(`Error getting students`)
    }
    response = await response.json()
    // This data might be fresher (group count set at login)
    // If so, update the student count for this group
    const count = response.length
    if (count !== rootGetters['user/activeGroup'].count) {
      commit('user/setCount', { groupId, count }, { root: true })
    }
    commit('setStudents', response)
  },
  async saveTarget({ commit, rootState }, { target, groupId, studentId }) {
    const url = new URL(
      '/.netlify/functions/updateTarget',
      this.$config.baseURL
    )
    await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        target,
        groupId,
        studentId,
      }),
      method: 'POST',
    })
    // Update local store
    commit('setTarget', { target, groupId, studentId })
  },
  async removeStudents(
    { commit, rootState, rootGetters },
    { groupId, studentIds }
  ) {
    const url = new URL(
      '/.netlify/functions/removeGroupStudent',
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
      throw new Error(`Error removing student(s) ${response.status}`)
    }
    commit('removeStudents', studentIds)
    // Remove students from group count
    const count = rootGetters['user/activeGroup'].count - studentIds.length
    commit('user/setCount', { groupId, count }, { root: true })
  },
}

export const mutations = {
  removeStudents(state, studentIds) {
    state.students = state.students.filter((o) => !studentIds.includes(o.id))
  },
  setStudents(state, students) {
    state.students = students
  },
  // Called on exit from _students.vue
  // Prevents seeing previous group's data
  clearStudents(state) {
    state.students = []
  },
  setTarget(state, { target, groupId, studentId }) {
    const i = state.students.findIndex((s) => s.id === studentId)
    state.students[i].target[groupId] = target
  },
}
