const getDefaultState = () => ({
  topics: [],
  questions: [],
  question: {}, // Question detail (not _course.vue preview)
  selected: [],
  topicId: '',
  currentTopicIndex: 0,
})

// eslint-disable-next-line no-unused-vars
const state = getDefaultState()

const getters = {
  // Get count of revision questions answered for a topic
  // topicId = '' until a revision topic is chosen
  topicCount: (state, getters, rootState) => {
    if (state.topicId === '' || rootState.user.teacher) return 0
    return state.topics.find(({ id }) => id === state.topicId).answered
  },
}

const actions = {
  resetState({ commit }) {
    commit('resetState')
  },
  async getQuestion({ commit, rootState }, questionId) {
    // Clear previous question
    commit('setQuestion', {})
    const url = new URL('/.netlify/functions/getQuestion', this.$config.baseURL)
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        questionId,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error fetching question (${response.status})`)
    }
    response = await response.json()
    commit('setQuestion', response)
  },
  // For teachers, get _course topics to browse questions
  // For students, get revision topic data
  async getTopics({ dispatch, commit, rootGetters, rootState }, courseId) {
    const url = new URL('/.netlify/functions/getTopics', this.$config.baseURL)
    // For students, courseId is not passed in
    // so get it from the current active group
    if (courseId === undefined) {
      courseId = rootGetters['user/activeGroup'].course.id
    }
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        teacher: rootState.user.teacher,
        courseId,
      }),
      method: 'POST',
    })
    // Throw error we can catch in the component
    if (!response.ok) {
      throw new Error(`${response.statusText} (${response.status})`)
    }
    response = await response.json()
    commit('setTopics', response)
    // For teachers only, dispatch a second action to get questions
    // (uses state.currentTopicIndex)
    if (rootState.user.teacher) {
      await dispatch('getQuestions')
    }
  },
  async getQuestions({ commit, state, rootState, rootGetters }) {
    const url = new URL(
      '/.netlify/functions/getQuestions',
      this.$config.baseURL
    )
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        topicId: state.topics[state.currentTopicIndex].id,
        groupId: rootGetters['user/activeGroup'].id, // To find past assignments
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`${response.statusText} ${response.status}`)
    }
    response = await response.json()
    commit('setQuestions', response)
  },
}

export const mutations = {
  setTopics(state, topics) {
    state.topics = topics
  },
  setTopicId(state, topicId) {
    state.topicId = topicId
  },
  incrementTopicCount(state) {
    const topicIndex = state.topics.findIndex((x) => x.id === state.topicId)
    state.topics[topicIndex].answered++
  },
  setCurrentTopicIndex(state, i) {
    state.currentTopicIndex = i
  },
  setQuestion(state, question) {
    state.question = question
  },
  setQuestions(state, questions) {
    // Debug issue with data doubling
    state.questions = []
    state.questions = questions
    console.log('%c' + 'SET state.questions', 'color:red')
    console.log(`n:`, state.questions.length)
  },
  updateSelected(state, questionId) {
    state.selected.includes(questionId)
      ? (state.selected = state.selected.filter((id) => id !== questionId))
      : state.selected.push(questionId)
  },
  clearSelectedQuestions(state) {
    state.selected = []
  },
  resetState(state) {
    Object.assign(state, getDefaultState())
  },
}

export default {
  state: getDefaultState,
  mutations,
  actions,
  getters,
}
