const getDefaultState = () => ({
  assignments: [],
  students: [],
  grades: [],
  courses: [],
})

// eslint-disable-next-line no-unused-vars
const state = getDefaultState()

const getters = {
  showCourses: (state) => (showAll) => {
    // Filter out inactive courses
    // (leave headers and dividers)
    const temp = state.courses.filter((o) => {
      if ('divider' in o || 'header' in o) return true
      return showAll || o.active === !showAll
    })
    // Clean up empty sections
    if (!showAll) {
      const toSplice = []
      temp.push({ header: '' })
      // Find indexes of empty sections
      for (let i = 0; i < temp.length - 2; i++) {
        if ('header' in temp[i] && 'header' in temp[i + 2]) {
          toSplice.unshift(i)
        }
      }
      temp.pop()
      // Splice empty sections starting from the end
      for (const x of toSplice) {
        temp.splice(x, 2)
      }
    }
    return temp
  },
}

const actions = {
  async getUpcoming({ commit, rootState }) {
    const path = rootState.user.teacher
      ? '/.netlify/functions/getRecentAssignments'
      : '/.netlify/functions/getUpcomingAssignments'
    const url = new URL(path, this.$config.baseURL)
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Error getting assignments')
    }
    response = await response.json()
    commit('setAssignments', response)
  },
  async getAssignments({ commit, rootState, rootGetters }) {
    const s = rootState.user.teacher
      ? 'getAssignmentsTeacher'
      : 'getAssignmentsStudent'
    const url = new URL(`/.netlify/functions/${s}`, this.$config.baseURL)
    const response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        groupId: rootGetters['user/activeGroup'].id,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Error getting assignments')
    }
    commit('setAssignments', await response.json())
  },
  async getCourses({ commit, rootState }) {
    const url = new URL('/.netlify/functions/getCourses', this.$config.baseURL)
    const response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error fetching courses ${response.status}`)
    }
    commit('setCourses', await response.json())
  },
  async getGrades({ commit, rootState, rootGetters }) {
    const url = new URL('/.netlify/functions/getGrades', this.$config.baseURL)
    const data = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        groupId: rootGetters['user/activeGroup'].id,
      }),
      method: 'POST',
    })
    if (!data.ok) {
      throw new Error(`Error fetching grades ${data.status}`)
    }
    commit('setGrades', await data.json())
  },
  async addStudents({ rootState, commit, rootGetters, dispatch }, usernames) {
    const url = new URL('/.netlify/functions/addStudents', this.$config.baseURL)
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        usernames,
        groupId: rootGetters['user/activeGroup'].id,
      }),
      method: 'POST',
    })
    response = await response.json()
    // Existing usernames appear as false in response array
    const failedCount = response.filter((o) => o === false).length
    if (failedCount > 0) {
      this.$snack.showMessage({
        msg: `${failedCount} users already have accounts`,
      })
    }
    if (!response.statusCode === '200') {
      throw new Error(`Error adding students`)
    }
    // No need to user/setCount—data is refreshed
    await dispatch('getStudents')
    // Send welcome email if username is an email address
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
    // Update group if nec.
    // (may have changed since login)
    const n = response.length
    if (n !== rootGetters['user/activeGroup'].count) {
      const group = rootGetters['user/activeGroup']
      commit('user/setCount', { group, n }, { root: true })
    }
    commit('setStudents', response)
  },
  async saveTarget({ commit, rootState }, { target, groupId, studentId }) {
    if (target === '') {
      target = '-'
    }
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
  async removeStudents({ commit, rootState, rootGetters }, studentIds) {
    const url = new URL(
      '/.netlify/functions/removeGroupStudent',
      this.$config.baseURL
    )
    const groupId = rootGetters['user/activeGroup'].id
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
    const group = rootGetters['user/activeGroup']
    const n = group.count - studentIds.length
    commit('user/setCount', { group, n }, { root: true })
  },
  resetState({ commit }) {
    commit('resetState')
  },
}

const mutations = {
  setAssignments(state, assignments) {
    state.assignments = assignments
  },
  setStudents(state, students) {
    state.students = students
  },
  setGrades(state, grades) {
    state.grades = grades
  },
  setCourses(state, courses) {
    state.courses = courses
  },
  setTarget(state, { target, groupId, studentId }) {
    const i = state.students.findIndex((s) => s.id === studentId)
    state.students[i].target[groupId] = target
  },
  removeStudents(state, studentIds) {
    state.students = state.students.filter((o) => !studentIds.includes(o.id))
  },
  resetState(state) {
    Object.assign(state, getDefaultState())
  },
}

export default {
  state: getDefaultState,
  getters,
  actions,
  mutations,
}
