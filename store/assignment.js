const getDefaultState = () => ({
  assignment: {},
  question: {},
  response: {},
  questionId: '',
  responseId: '',
  studentIndex: '',
  questionIndex: '',
  marking: false,
  students: [],
})

// eslint-disable-next-line no-unused-vars
const state = getDefaultState()

const getters = {
  // getReport returns a big data structure containing
  // all the assignment info (including group), headers
  // (containing question), and students (each with an
  // array of responses). studentIndex gets us into the
  // students array. Each student object has a key
  // 'responses' containing an array of responses
  // (*one per question*).
  response: (state) => {
    if (!state.marking) return {}
    const student = state.assignment.students[state.studentIndex]
    return student.responses[state.questionIndex - 1]
  },
  question: (state) => {
    if (!state.marking) return {}
    return state.assignment.headers[state.questionIndex]
  },
  studentById: (state) => (id) => {
    return state.students.find((s) => s.id === id)
  },
}

const actions = {
  async createAssignment({ commit, rootState }, assObj) {
    const url = new URL(
      '/.netlify/functions/createAssignment',
      this.$config.baseURL
    )
    assObj.secret = rootState.user.secret
    const assignment = await fetch(url, {
      body: JSON.stringify(assObj),
      method: 'POST',
    })
    if (!assignment.ok) {
      throw new Error('Error creating assignment')
    }
    // Show 'Assignments' tab on _group.vue
    commit('app/setTab', 0, { root: true })
    // No need to update local data
    // (Fetched again on _group.vue)
  },
  async getStudents({ commit, rootState, rootGetters }) {
    const url = new URL('/.netlify/functions/getStudents', this.$config.baseURL)
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        groupId: rootGetters['user/activeGroup'].id,
        namesOnly: true,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error fetching students ${response.status}`)
    }
    response = await response.json()
    commit('setStudents', response)
  },
  async setExamMode({ commit, rootState, getters }, { studentId, mode }) {
    const url = new URL('/.netlify/functions/setExamMode', this.$config.baseURL)
    const response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        studentId,
        examMode: mode,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Error setting exam mode')
    }
    // Update local data
    const student = getters.studentById(studentId)
    commit('setExamMode', { student, mode })
  },
  async getQuestion({ state, commit, rootState }) {
    // Separate functions for teachers and students
    // (Student needs basic info. Teacher will grow)
    const f = rootState.user.teacher ? 'getQuestion' : 'getQuestionStudent'
    const url = new URL(`/.netlify/functions/${f}`, this.$config.baseURL)
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
    commit('setQuestionId', response)
  },
  async saveAnswer({ commit, state, rootState, rootGetters }, text) {
    const url = new URL('/.netlify/functions/saveAnswer', this.$config.baseURL)
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        assignmentId: state.assignment.id,
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
      `>> ${response} << ` + '%cResponse',
      'padding:2px 4px;background-color:#00668b;color:white;border-radius:3px'
    )
    // Save responseId (all /saveAnswer returns) for subsequent saves
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
    commit('setAssignment', {})
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
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        responseId,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Error fetching response')
    }
    response = await response.json()
    commit('setResponse', response)
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
  setQuestionId(state, questionId) {
    state.questionId = questionId
  },
  setResponseId(state, responseId) {
    state.responseId = responseId
  },
  addAssignment(state, { assignment, group }) {
    group.assignments.unshift({ ...assignment })
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
  setStudents(state, students) {
    state.students = students
  },
  setExamMode(state, { student, mode }) {
    student.examMode = mode
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
