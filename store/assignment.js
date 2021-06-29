// Helper function to find response
function getResponse(state) {
  return state.assignment.students[state.studentIndex].data[
    state.questionIndex
  ][state.assignment.headers[state.questionIndex + 1].value][
    state.responseIndex
  ]
}

export const state = () => ({
  assignment: {}, // _report.vue data structure
  assignmentId: '',
  questionId: '',
  // Info ^^^ for answer.vue
  topics: [], // Student revision and teacher -> _course.vue
  selected: [],
  response: {}, // _response.vue
  studentIndex: '',
  questionIndex: '',
  responseIndex: '',
  // Indecies ^^^ into _report.vue data structure
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
  // Sets flag property of response in database
  // Commits mutation to update local store
  async flagResponse({ commit, rootState }, { responseId, flagged }) {
    console.log(`flagAction`, responseId, flagged)
    const url = new URL(
      '/.netlify/functions/flagResponse',
      this.$config.baseURL
    )
    await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        responseId,
        flagged,
      }),
      method: 'POST',
    })
    commit('setFlag', flagged)
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
      assignmentId = rootGetters['user/activeGroup'].assignments[0].id
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
  setResponse(state, response) {
    state.response = response
  },
  // **_report.vue mutations**
  setStudentIndex(state, i) {
    state.studentIndex = i
  },
  setResponseIndex(state, i) {
    state.responseIndex = i
  },
  setQuestionIndex(state, i) {
    state.questionIndex = i
  },
  setFlag(state, flagged) {
    const response = getResponse(state)
    response.flagged = flagged
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
  setTeacherMarks(state) {},
  setMarked(state) {},
}
