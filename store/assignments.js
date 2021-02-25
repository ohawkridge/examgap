export const state = () => ({
  assignmentId: '',
  questionId: '',
  topicId: '',
  groupId: '',
})

export const mutations = {
  // Remember which question in which assignment
  // a student is about to answer
  setAnswerData(state, { assignmentId, questionId }) {
    state.assignmentId = assignmentId
    state.questionId = questionId
  },
  // Remember the topic if revising
  setCurrentTopic(state, topicId) {
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
