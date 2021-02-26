export const state = () => ({
  assignmentId: '',
  questionId: '',
  topicId: '',
  groupId: '',
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
  logout(state) {
    state.assignmentId = ''
    state.questionId = ''
    state.topicId = ''
    state.groupId = ''
  },
}
