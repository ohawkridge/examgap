export const state = () => ({
  assignment: {}, // Student assignment cache
  assignmentId: '',
  questionId: '',
  topicId: '',
  selected: [],
  currentTopic: 0,
})

export const actions = {
  async getAssignment({ commit, rootState, state }, assignmentId) {
    console.log('getAssignment (to store):', assignmentId)
    const url = new URL(
      '/.netlify/functions/getAssignment',
      this.$config.baseURL
    )
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        assignmentId,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error fetching assignment ${response.status}`)
    }
    response = await response.json()
    commit('setAssignment', response)
  },
}

export const mutations = {
  setAssignment(state, data) {
    state.assignment = data
  },
  setAnswerData(state, { assignmentId, questionId }) {
    state.assignmentId = assignmentId
    state.questionId = questionId
  },
  setCurrentTopicId(state, topicId) {
    state.topicId = topicId
  },
  setCurrentTopic(state, index) {
    state.currentTopic = index
  },
  // Add/remove questionId from selected questions
  updateSelectedQuestions(state, questionId) {
    state.selected.includes(questionId)
      ? (state.selected = state.selected.filter((id) => id !== questionId))
      : state.selected.push(questionId)
  },
  clearSelectedQuestions(state) {
    state.selected = []
  },
  logout(state) {
    state.assignment = {}
    state.assignmentId = ''
    state.questionId = ''
    state.topicId = ''
    state.selected = []
    state.currentTopic = 0
  },
}
