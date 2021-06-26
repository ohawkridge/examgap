export const state = () => ({
  topics: [],
  topicId: '',
})

export const actions = {
  // For teachers, get _course topics to browse questions
  // For students, get revision topic data
  async getTopics({ commit, getters, rootState }, courseId) {
    const url = new URL('/.netlify/functions/getTopics', this.$config.baseURL)
    // For students, courseId is not passed in
    // ∴ get it from the current active group
    if (courseId === undefined) {
      courseId = getters.activeGroup.course.id
    }
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: rootState.user.secret,
        courseId,
      }),
      method: 'POST',
    })
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
    // for (let i = 0; i < state.revisionTopics.length; i++) {
    //   if (state.revisionTopics[i].id === state.currentRevisionTopic.id) {
    //     state.revisionTopics[i].answered += 1
    //   }
    // }
    // TODO test
    for (const topic of state.topics) {
      if (topic.id === state.topicId) {
        topic.answered++
      }
    }
  },
}
