export const state = () => ({
  topics: [],
  topicId: '',
})

export const getters = {
  // TODO Isn't this value already returned by getTopics.js?
  topicCount: (state) => {
    return state.topics.find(({ id }) => id === state.topicId).answered
  },
}

export const actions = {
  // For teachers, get _course topics to browse questions
  // For students, get revision topic data
  async getTopics({ commit, rootGetters, rootState }, courseId) {
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
    if (!response.ok) {
      throw new Error(`getTopics\n ${response.statusText} (${response.status})`)
    }
    response = await response.json()
    commit('setTopics', response)
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
}
