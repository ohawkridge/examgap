export const state = () => ({
  activeGroupId: '',
  students: [],
  grades: [],
})

export const actions = {
  async getGrades() {
    const url = new URL('/.netlify/functions/getGrades', this.$config.baseURL)
    const data = await fetch(url, {
      body: JSON.stringify({
        secret: this.$store.state.user.secret,
        groupId: this.group.id,
      }),
      method: 'POST',
    })
    if (!data.ok) {
      throw new Error(`Error fetching grades ${data.status}`)
    }
    this.data = await data.json()
  },
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
    const count = rootGetters['group/activeGroup'].count + usernames.length
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
    const groupId = rootGetters['group/activeGroup'].id
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
    if (count !== rootGetters['group/activeGroup'].count) {
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
    const count = rootGetters['group/activeGroup'].count - studentIds.length
    commit('user/setCount', { groupId, count }, { root: true })
  },
}

export const mutations = {
  setActiveGroupId(state, id) {
    // When a new class is created, TheCreateClassDialog sends -1
    // If so, set the most recent group (last in array) as active
    if (id === -1) {
      id = state.groups[state.groups.length - 1].id
    }
    state.activeGroupId = id
  },
  setCount(state, { groupId, count }) {
    const i = state.groups.findIndex((g) => g.id === groupId)
    state.groups[i].count = count
  },
  setTarget(state, { target, groupId, studentId }) {
    const i = state.students.findIndex((s) => s.id === studentId)
    state.students[i].target[groupId] = target
  },
  removeStudents(state, studentIds) {
    state.students = state.students.filter((o) => !studentIds.includes(o.id))
  },
  setStudents(state, students) {
    state.students = students
  },
  addAssignment(state, assignment) {
    // Add assignment to *front* of assignments array
    state.groups[state.activeGroupId].assignments.unshift({
      dateDue: assignment.data.dateDue,
      id: assignment.ref['@ref'].id,
      name: assignment.data.name,
      start: assignment.data.start,
    })
  },
  deleteAssignment(state, assignmentId) {
    const assignments = state.groups[state.activeGroupId].assignments
    const i = assignments.findIndex((a) => a.id === assignmentId)
    assignments.splice(i, 1)
  },
  setNameAndCourse(state, { id, name, course }) {
    const i = state.groups.findIndex((g) => g.id === id)
    state.groups[i].name = name
    state.groups[i].course = { ...course }
  },
  setArchived(state) {
    state.groups[state.activeGroupId].active = false
  },
  updateGroupName(state, name) {
    state.groups[state.activeGroupId].name = name
  },
}
