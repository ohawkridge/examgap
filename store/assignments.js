export const state = () => ({
  assignmentId: '',
  questionId: '',
})

export const mutations = {
  // Remember which question in which assignment
  // a student is about to answer
  setAnswerData(state, { assignmentId, questionId }) {
    state.assignmentId = assignmentId
    state.questionId = questionId
  },
}
