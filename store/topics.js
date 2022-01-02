const getDefaultState = () => ({
  topics: [],
  questions: [],
  question: {},
  topicId: '',
  topicName: '',
})

// eslint-disable-next-line no-unused-vars
const state = getDefaultState()

const getters = {
  // Get count of revision questions answered for topic
  topicCount: (state, getters, rootState) => {
    if (state.topicId === '' || rootState.user.teacher) return 0
    return state.topics.find(({ id }) => id === state.topicId).numAnswered
  },
  // Get topic name based on current topic id
  currentTopicName: (state) => {
    return state.topics.find((t) => t.id === state.topicId).name
  },
}

const actions = {
  async saveQuestion({ rootState }, { edit, question }) {
    const url = new URL(
      '/.netlify/functions/saveQuestion',
      this.$config.baseURL
    )
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        edit,
        question,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Error saving question')
    }
    response = await response.json()
    return response
  },
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
  async getAllTopics({ commit, rootState }, allCourses) {
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
      throw new Error('Error fetching topics')
    }
    topics = await topics.json()
    commit('setTopics', topics)
  },
  async getQuestion({ commit, rootState }, questionId) {
    console.debug({ questionId })
    // Clear previous question to avoid flash of old
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
  setQuestions(state, questions) {
    state.questions = questions
  },
  setQuestion(state, question) {
    state.question = question
  },
  setTopicId(state, topicId) {
    state.topicId = topicId
  },
  setTopicName(state, name) {
    state.topicName = name
  },
  incrementTopicCount(state) {
    const topicIndex = state.topics.findIndex((x) => x.id === state.topicId)
    state.topics[topicIndex].answered++
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
