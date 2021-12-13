const getDefaultState = () => ({
  topics: [],
  question: {},
  selected: [],
  questions: [],
  topicId: '',
  topicName: '',
  currentTopicIndex: 0,
  autoCompleteTopics: [],
})

// eslint-disable-next-line no-unused-vars
const state = getDefaultState()

const getters = {
  // Get count of revision questions answered for a topic
  topicCount: (state, getters, rootState) => {
    if (state.topicId === '' || rootState.user.teacher) return 0
    return state.topics.find(({ id }) => id === state.topicId).numAnswered
  },
}

const actions = {
  async getRevision({ commit, rootGetters, rootState }) {
    const url = new URL('/.netlify/functions/getRevision', this.$config.baseURL)
    const response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        courseId: rootGetters['user/activeGroup'].course.id,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Error getting revision')
    }
    commit('setTopics', await response.json())
  },
  async getACTopics({ commit, rootState }, allCourses) {
    const url = new URL(
      '/.netlify/functions/getAllTopics',
      this.$config.baseURL
    )
    let topics = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        allCourses,
      }),
      method: 'POST',
    })
    if (!topics.ok) {
      throw new Error(`Error fetching topics ${topics.status}`)
    }
    topics = await topics.json()
    commit('setACTopics', topics)
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
  async getTopics({ commit, rootState }, courseId) {
    commit('app/setLoading', true, { root: true })
    const url = new URL('/.netlify/functions/getTopics', this.$config.baseURL)
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        teacher: rootState.user.teacher,
        courseId,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Error getting topics')
    }
    response = await response.json()
    commit('setTopics', response)
    commit('app/setLoading', false, { root: true })
  },
  async getQuestions({ commit, rootState, rootGetters }, topicId) {
    const url = new URL(
      '/.netlify/functions/getQuestions',
      this.$config.baseURL
    )
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        topicId,
        groupId: rootGetters['user/activeGroup'].id, // To find past assignments
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Error getting questions')
    }
    response = await response.json()
    commit('setQuestions', response)
  },
  resetState({ commit }) {
    commit('resetState')
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
  setACTopics(state, topics) {
    state.autoCompleteTopics = topics
  },
  updateSelected(state, questionId) {
    state.selected.includes(questionId)
      ? (state.selected = state.selected.filter((id) => id !== questionId))
      : state.selected.push(questionId)
  },
  setTopicName(state, name) {
    state.topicName = name
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
