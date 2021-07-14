export const state = () => ({
  students: [], // _students.vue
})

export const actions = {
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
    if (!response.ok) {
      throw new Error(
        `Error getting students \n ${response.statusText} (${response.status})`
      )
    }
    response = await response.json()
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
}

export const mutations = {
  setStudents(state, students) {
    state.students = students
  },
  setTarget(state, { target, groupId, studentId }) {
    const i = state.students.findIndex((s) => s.id === studentId)
    state.students[i].target[groupId] = target
  },
}
