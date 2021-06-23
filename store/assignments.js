export const state = () => ({
  assignment: {},
  assignmentId: '',
  questionId: '',
  topics: [],
  topicId: '',
  selected: [],
  response: {
    question: {},
    tm: [],
    sm: [],
  },
})

export const actions = {
  async getTopics({ commit, rootState }, courseId) {
    const url = new URL('/.netlify/functions/getTopics', this.$config.baseURL)
    const response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        courseId,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error fetching topics ${response.status}`)
    }
    commit('setTopics', await response.json())
  },
  // For students (_assignment.vue)
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
  // For teachers (_report.vue)
  async getReport({ commit, rootState, rootGetters }, assignmentId) {
    const url = new URL('/.netlify/functions/getReport', this.$config.baseURL)
    // *Attempt pre-fetch*
    // _group.vue sends -1 if no assignment cached yet
    if (assignmentId === -1) {
      // Select id of most recent assignment
      assignmentId = rootGetters['groups/activeGroup'].assignments[0].id
    }
    const response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        assignmentId,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error fetching data ${response.status}`)
    }
    commit('setAssignment', await response.json())
    console.log('%c' + `Stored ${assignmentId}`, 'color:red;')
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
  setTopics(state, topics) {
    state.topics = topics
  },
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
  updateSelectedQuestions(state, questionId) {
    state.selected.includes(questionId)
      ? (state.selected = state.selected.filter((id) => id !== questionId))
      : state.selected.push(questionId)
  },
  clearSelectedQuestions(state) {
    state.selected = []
  },
  // _report.vue
  // Big data structure mutations
  flag(state) {},
  reassign(state) {},
  setFeedback(state) {},
  logout(state) {
    state.assignment = {}
    state.assignmentId = ''
    state.questionId = ''
    state.topics = []
    state.topicId = ''
    state.selected = []
    state.response = {
      question: {},
      tm: [],
      sm: [],
    }
  },
}
