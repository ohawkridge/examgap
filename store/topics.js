export const state = () => ({
  topics: [],
  questions: [],
  question: {}, // Question detail (not _course.vue preview)
  selected: [],
  topicId: '',
  currentTopicIndex: 0,
  loading: false,
})

export const getters = {
  // TODO Isn't this value already returned by getTopics.js?
  topicCount: (state) => {
    return state.topics.find(({ id }) => id === state.topicId).answered
  },
}

export const actions = {
  async getQuestion({ commit, rootState }, questionId) {
    console.log('%c' + 'dispatch -> getQuestion', 'color:purple')
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
    // Dispatch a second action to get questions
    // (uses state.currentTopicIndex)
    await dispatch('getQuestions')
  },
  async getQuestions({ commit, state, rootState, rootGetters }) {
    commit('setLoading', true)
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
    commit('setLoading', false)
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
    state.questions = questions
  },
  updateSelectedQuestions(state, questionId) {
    state.selected.includes(questionId)
      ? (state.selected = state.selected.filter((id) => id !== questionId))
      : state.selected.push(questionId)
  },
  clearSelectedQuestions(state) {
    state.selected = []
  },
  setLoading(state, loading) {
    state.loading = loading
  },
}
