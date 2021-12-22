const getDefaultState = () => ({
  assignment: {},
  question: {},
  response: {},
  assignmentId: '',
  questionId: '',
  responseId: '',
  studentIndex: '',
  questionIndex: '',
  marking: false,
})

// eslint-disable-next-line no-unused-vars
const state = getDefaultState()

// getAssignment() returns a massive data structure
// (see file in Examgap/json). Its two main keys are:
// headers and students. studentIndex gets us
// horizontally into the student array. Each student
// object has two main keys: name and data. data is an
// array of objects (one for each question). Within
// these objects is an array of the student's answers.
// If the question has been reassigned, they could have more
// than one response. This getter returns a single
// response object.
const getters = {
  response: (state) => {
    if (!state.marking) return {}
    return state.assignment.students[state.studentIndex].data[
      state.questionIndex
    ][state.assignment.headers[state.questionIndex + 1].value]
  },
}

const actions = {
  async getQuestion({ state, commit, rootState }) {
    const url = new URL('/.netlify/functions/getQuestion', this.$config.baseURL)
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        questionId: state.questionId,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error fetching question ${response.status}`)
    }
    response = await response.json()
    commit('setQuestion', response)
  },
  async getRevisionQuestion({ commit, rootState, rootGetters }) {
    const url = new URL(
      '/.netlify/functions/getRevisionQuestionId',
      this.$config.baseURL
    )
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        topicId: rootState.topics.topicId,
        answered: rootGetters['topics/topicCount'],
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error getting questionId ${response.status}`)
    }
    response = await response.json()
    // Store question info for later
    commit('setAnswerData', {
      assignmentId: '',
      questionId: response,
    })
  },
  async saveAnswer({ commit, state, rootState, rootGetters }, text) {
    const url = new URL('/.netlify/functions/saveAnswer', this.$config.baseURL)
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        assignmentId: state.assignmentId,
        questionId: state.questionId,
        text,
        topicId: rootState.topics.topicId, // If revising
        responseId: state.responseId,
        groupId: rootGetters['user/activeGroup'].id,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error saving answer ${response.status}`)
    }
    response = await response.json()
    console.debug(
      '%c' + 'Response',
      'padding:2px 4px;background-color:#00668b;color:white;border-radius:3px'
    )
    console.log(response)
    // Set responseId (all saveAnswer returns) for
    // use in subsequent saves to update answer text
    // No need to store whole response locally as
    // _assignment fetches new data each time
    commit('setResponseId', response)
  },
  async saveSelfMarks({ state, rootState }, markIds) {
    const url = new URL(
      '/.netlify/functions/saveSelfMarks',
      this.$config.baseURL
    )
    await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        responseId: state.responseId, // Already stored from first debounce
        markIds,
      }),
      method: 'POST',
    })
  },
  async saveMarks({ commit, getters, rootState }, markIds) {
    const response = getters.response
    const url = new URL(
      '/.netlify/functions/saveTeacherMarks',
      this.$config.baseURL
    )
    await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        responseId: response.id,
        markIds,
      }),
      method: 'POST',
    })
    commit('setTeacherMarks', { response, markIds })
  },
  async saveFeedback({ getters, rootState }, feedback) {
    if (feedback !== undefined) {
      const response = getters.response
      const url = new URL(
        '/.netlify/functions/saveFeedback',
        this.$config.baseURL
      )
      await fetch(url, {
        body: JSON.stringify({
          secret: rootState.user.secret,
          responseId: response.id,
          feedback,
        }),
        method: 'POST',
      })
    }
  },
  // (Dispatched from _report.vue)
  // Sets flag property of response in database
  // Commits mutation to update local store
  async flagResponse({ commit, getters, rootState }) {
    const response = getters.response
    const flagged = !response.flagged
    const url = new URL(
      '/.netlify/functions/flagResponse',
      this.$config.baseURL
    )
    await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        responseId: response.id,
        flagged,
      }),
      method: 'POST',
    })
    // Mutate local data
    commit('setFlag', { response, flagged })
  },
  async setMarked({ commit, getters, rootState }) {
    const response = getters.response
    const url = new URL('/.netlify/functions/setAsMarked', this.$config.baseURL)
    await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        responseId: response.id,
      }),
      method: 'POST',
    })
    commit('setMarked', response)
  },
  async getAssignment({ commit, rootState }, assignmentId) {
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
      throw new Error('Error fetching assignment')
    }
    response = await response.json()
    commit('setAssignment', response)
  },
  async getReport({ commit, rootState }, assignmentId) {
    console.debug(
      '%c' + 'Fetch',
      'padding:2px 4px;background-color:#ffe089;color:#765b00;border-radius:3px'
    )
    const url = new URL('/.netlify/functions/getReport', this.$config.baseURL)
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        assignmentId,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Error getting report')
    }
    response = await response.json()
    commit('setAssignment', response)
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
      throw new Error('Error fetching response')
    }
    commit('setResponse', await response.json())
  },
  resetState({ commit }) {
    commit('resetState')
  },
}

const mutations = {
  // State mutations xx
  setAssignment(state, data) {
    state.assignment = data
  },
  setQuestion(state, question) {
    state.question = question
  },
  setResponse(state, response) {
    state.response = response
  },
  setAnswerData(state, { assignmentId, questionId }) {
    state.assignmentId = assignmentId
    state.questionId = questionId
  },
  setResponseId(state, responseId) {
    state.responseId = responseId
  },
  setStudentIndex(state, i) {
    state.studentIndex = i
  },
  setQuestionIndex(state, i) {
    state.questionIndex = i
  },
  setMarking(state, marking) {
    state.marking = marking
  },
  // Response mutations xx
  setFlag(state, { response, flagged }) {
    response.flagged = flagged
  },
  setFeedback(state, { response, feedback }) {
    response.feedback = feedback
  },
  setTeacherMarks(state, { response, markIds }) {
    response.tm = markIds
  },
  setMarked(state, response) {
    response.marked = true
  },
  // Navigate to next(1)/previous(-1) response
  // (loop around if nec.)
  next(state, n) {
    if (n === 1) {
      state.studentIndex >= state.assignment.students.length - 1
        ? (state.studentIndex = 0)
        : (state.studentIndex += 1)
    } else {
      state.studentIndex === 0
        ? (state.studentIndex = state.assignment.students.length - 1)
        : (state.studentIndex -= 1)
    }
  },
  resetState(state) {
    Object.assign(state, getDefaultState())
  },
}

export default {
  state: getDefaultState,
  actions,
  mutations,
  getters,
}
