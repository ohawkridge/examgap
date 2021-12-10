const getDefaultState = () => ({
  assignmentId: '',
  questionId: '',
  responseId: '', // debounced saved answer
  // Info ^^^ for answer.vue
  response: {}, // _response.vue
  assignment: {}, // _report.vue data structure + _assignment.vue
  studentIndex: '',
  questionIndex: '',
  responseIndex: '',
  // Indecies ^^^ into _report.vue data structure
  marking: false,
  question: {}, // The question to answer
  recentAssignments: [],
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
    ][state.assignment.headers[state.questionIndex + 1].value][
      state.responseIndex
    ]
  },
}

const actions = {
  resetState({ commit }) {
    commit('resetState')
  },
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
  // Get next revision question for selected topic
  async revise({ commit, rootState, rootGetters }) {
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
    console.log(
      '%c' + 'Response',
      'padding:2px 4px;background-color:#0078a0;color:white;border-radius:3px'
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
    // console.debug('%c' + `saveTeacherMarks ${response.id}`, 'color:darkblue')
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
      // console.debug('%c' + `saveFeedback ${response.id}`, 'color:darkgreen')
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
  async reassign({ commit, getters, rootState }) {
    const response = getters.response
    const repeat = !response.repeat
    const url = new URL(
      '/.netlify/functions/reassignQuestion',
      this.$config.baseURL
    )
    await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        responseId: response.id,
        repeat,
      }),
      method: 'POST',
    })
    commit('setReassign', { response, repeat })
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
  // For students (_assignment.vue)
  async getAssignment({ commit, rootState }, assignmentId) {
    commit('app/setLoading', true, { root: true })
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
    commit('app/setPageTitle', response.name, { root: true })
    commit('app/setLoading', false, { root: true })
  },
  async getReport({ commit, rootState, rootGetters }, assignmentId) {
    commit('app/setLoading', true, { root: true })
    const numAssignments = rootGetters['user/activeGroup'].assignments.length
    if (numAssignments > 0) {
      // _group.vue sends -1 if attempting to
      // pre-fetch most-recent assignment.
      // Replace with actual most recent id
      if (assignmentId === -1) {
        assignmentId = rootGetters['user/activeGroup'].assignments[0].id
      }
      const url = new URL('/.netlify/functions/getReport', this.$config.baseURL)
      let response = await fetch(url, {
        body: JSON.stringify({
          secret: rootState.user.secret,
          assignmentId,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error fetching data ${response.status}`)
      }
      response = await response.json()
      commit('app/setPageTitle', response.name, { root: true })
      commit('setAssignment', response)
    }
    commit('app/setLoading', false, { root: true })
  },
  async getResponse({ commit, rootState }, responseId) {
    commit('app/setLoading', true, { root: true })
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
    commit('app/setLoading', false, { root: true })
  },
}

const mutations = {
  setAssignment(state, data) {
    state.assignment = data
  },
  setQuestion(state, question) {
    state.question = question
  },
  setAnswerData(state, { assignmentId, questionId }) {
    state.assignmentId = assignmentId
    state.questionId = questionId
  },
  setCurrentTopicId(state, topicId) {
    state.topicId = topicId
  },
  setResponse(state, response) {
    state.response = response
  },
  setResponseId(state, responseId) {
    state.responseId = responseId
  },
  setMarking(state, marking) {
    state.marking = marking
  },
  setStudentIndex(state, i) {
    state.studentIndex = i
  },
  setResponseIndex(state, i) {
    state.responseIndex = i
  },
  setQuestionIndex(state, i) {
    state.questionIndex = i
  },
  setFlag(state, { response, flagged }) {
    response.flagged = flagged
  },
  setReassign(state, { response, repeat }) {
    response.repeat = repeat
  },
  setFeedback(state, { response, feedback }) {
    response.feedback = feedback
  },
  setTeacherMarks(state, { response, markIds }) {
    // Reactivity issue?
    // Mutation operates on object passed in
    response.tm = []
    for (const t of markIds) {
      response.tm.push(t)
    }
    // response.tm = markIds
  },
  setMarked(state, response) {
    response.marked = true
  },
  setRecent(state, assignments) {
    state.recentAssignments = assignments
  },
  // Navigate to next (1)/previous (-1) response
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
