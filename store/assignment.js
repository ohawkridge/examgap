export const state = () => ({
  assignment: {}, // _report.vue data structure
  assignmentId: '',
  questionId: '',
  // Info ^^^ for answer.vue
  topics: [], //
  selected: [],
  response: {
    question: {},
    tm: [],
    sm: [],
  },
})

export const actions = {
  async reassign({ commit, rootState }, payload) {
    const url = new URL(
      '/.netlify/functions/reassignQuestion',
      this.$config.baseURL
    )
    await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        responseId: payload.responseId,
        repeat: payload.repeat,
      }),
      method: 'POST',
    })
    commit('setReassign', payload)
  },
  // Dispatched from _report.vue
  // Sets flag property of a response in the db
  async flagResponse({ commit, rootState }, payload) {
    const url = new URL(
      '/.netlify/functions/flagResponse',
      this.$config.baseURL
    )
    await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        responseId: payload.responseId,
        flagged: payload.flag,
      }),
      method: 'POST',
    })
    // Sets flag in local data
    commit('setFlag', payload)
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
  // _report.vue data structure mutations
  setFlag(state, { studentIndex, questionIndex, responseIndex, qIdStr, flag }) {
    state.assignment.students[studentIndex].data[questionIndex][qIdStr][
      responseIndex
    ].flagged = flag
  },
  setReassign(
    state,
    { studentIndex, questionIndex, responseIndex, qIdStr, repeat }
  ) {
    state.assignment.students[studentIndex].data[questionIndex][qIdStr][
      responseIndex
    ].repeat = repeat
  },
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
