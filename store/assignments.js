export const state = () => ({
  assignmentId: '',
  questionId: '',
  topicId: '',
  groupId: '',
  selectedQuestions: [],
  currentTopic: 0,
  loggingOut: false,
})

export const mutations = {
  setAnswerData(state, { assignmentId, questionId }) {
    state.assignmentId = assignmentId
    state.questionId = questionId
  },
  setCurrentTopicId(state, topicId) {
    state.topicId = topicId
  },
  setGroup(state, groupId) {
    state.groupId = groupId
  },
  setCurrentTopic(state, index) {
    state.currentTopic = index
  },
  updateSelectedQuestions(state, questionId) {
    // Add or remove questionId from selectedQuestions
    if (state.selectedQuestions.includes(questionId)) {
      state.selectedQuestions = state.selectedQuestions.filter(
        (id) => id !== questionId
      )
    } else {
      state.selectedQuestions.push(questionId)
    }
  },
  clearSelectedQuestions(state) {
    state.selectedQuestions = []
  },
  logout(state) {
    state.loggingOut = true
    state.assignmentId = ''
    state.questionId = ''
    state.topicId = ''
    state.groupId = ''
    state.selectedQuestions = []
    state.currentTopic = 0
  },
}
