export const state = () => ({
  assignmentId: '',
  questionId: '',
  // Info ^^^ for answer.vue
  topics: [], // Student revision and teacher -> _course.vue
  selected: [],
  response: {}, // _response.vue
  assignment: {}, // _report.vue data structure
  studentIndex: '',
  questionIndex: '',
  responseIndex: '',
  // Indecies ^^^ into _report.vue data structure
  marking: false,
})

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
export const getters = {
  response: (state) => {
    if (!state.marking) return {}
    return state.assignment.students[state.studentIndex].data[
      state.questionIndex
    ][state.assignment.headers[state.questionIndex + 1].value][
      state.responseIndex
    ]
  },
}

export const actions = {
  async saveMarks({ commit, getters, rootState }, markIds) {
    console.log(`saving marks`, markIds)
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
    console.log('%c' + 'marked ✓', 'color:blue')
    console.log(response.id)
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
    response.tm = markIds
  },
  setMarked(state, response) {
    response.marked = true
  },
  // Navigate to next/previous responses
  // (looping around if nec.)
  next(state) {
    state.studentIndex >= state.assignment.students.length - 1
      ? (state.studentIndex = 0)
      : (state.studentIndex += 1)
  },
  previous(state) {
    state.studentIndex === 0
      ? (state.studentIndex = state.assignment.students.length - 1)
      : (state.studentIndex -= 1)
  },
}
