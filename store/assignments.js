export const state = () => ({
  assignmentId: '',
  questionId: '',
  topicId: '',
  selected: [],
  currentTopic: 0,
})

export const mutations = {
  setAnswerData(state, { assignmentId, questionId }) {
    state.assignmentId = assignmentId
    state.questionId = questionId
  },
  setCurrentTopicId(state, topicId) {
    state.topicId = topicId
  },
  setCurrentTopic(state, index) {
    state.currentTopic = index
  },
  updateSelectedQuestions(state, questionId) {
    // Add or remove questionId from selected questions
    if (state.selected.includes(questionId)) {
      state.selected = state.selected.filter((id) => id !== questionId)
    } else {
      state.selected.push(questionId)
    }
  },
  clearSelectedQuestions(state) {
    state.selected = []
  },
  logout(state) {
    state.assignmentId = ''
    state.questionId = ''
    state.topicId = ''
    state.selected = []
    state.currentTopic = 0
  },
}
