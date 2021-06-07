export const state = () => ({
  assignment: {},
  assignmentId: '',
  questionId: '',
  topicId: '',
  selected: [],
  currentTopic: 0,
  response: {
    question: {},
    tm: [],
    sm: [],
  },
})

export const actions = {
  async getAssignment({ commit, rootState }, assignmentId) {
    const url = new URL(
      '/.netlify/functions/getAssignment',
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
      throw new Error(`Error fetching assignment ${response.status}`)
    }
    commit('setAssignment', await response.json())
  },
  async getResponse({ commit, rootState }, responseId) {
    const url = new URL('/.netlify/functions/getResponse', this.$config.baseURL)
    const response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        responseId,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error fetching response ${responseId}`, response.status)
    }
    commit('setResponse', await response.json())
  },
}

export const mutations = {
  setResponse(state, data) {
    state.response = data
  },
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
    state.response = {
      question: {},
      tm: [],
      sm: [],
    }
  },
}
