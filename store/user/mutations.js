export default {
  setActiveGroupIndex(state, i) {
    // TheCreateClassDialog sends -1 as active group
    state.activeGroupIndex = i === -1 ? state.groups.length - 1 : i
  },
  addGroup(state, group) {
    state.groups.push(group)
  },
  setQuote(state, quote) {
    state.quote = quote
  },
  setCount(state, { groupId, count }) {
    const i = state.groups.findIndex((g) => g.id === groupId)
    state.groups[i].count = count
  },
  addAssignment(state, assignment) {
    // Add assignment to *front* of assignments array
    state.groups[state.activeGroupIndex].assignments.unshift({
      dateDue: assignment.data.dateDue,
      id: assignment.ref['@ref'].id,
      name: assignment.data.name,
      start: assignment.data.start,
    })
  },
  deleteAssignment(state, assignmentId) {
    const assignments = state.groups[state.activeGroupIndex].assignments
    const i = assignments.findIndex((a) => a.id === assignmentId)
    assignments.splice(i, 1)
  },
  // TODO Won't need?
  // New streamed assignment for student
  newAssignment(state, assignment) {
    // Find index of group assignment is for
    const groupIndex = state.groups.findIndex((g) => g.id === assignment.group)
    // Add assignment to front of assignments array
    state.groups[groupIndex].assignments.unshift(assignment)
  },
  setUser(state, data) {
    // Common properties
    state.id = data.id
    state.username = data.username
    state.secret = data.secret
    localStorage.setItem('secret', data.secret)
    state.teacher = data.teacher
    if (data.teacher) {
      // Teacher properties
      state.subscriptionDays = data.subscriptionDays
      state.school = data.school
      state.subscribed = data.subscribed
      state.subscriptionExpires = data.subscriptionExpires
    } else {
      // Student properties
      state.examMode = data.examMode
    }
  },
  setExamMode(state, val) {
    state.examMode = val
  },
  setRevisionExamMode(state, val) {
    state.reviseExamMode = val
  },
  setGroups(state, groups) {
    state.groups = groups
  },
  setNameAndCourse(state, { id, name, course }) {
    const i = state.groups.findIndex((g) => g.id === id)
    state.groups[i].name = name
    state.groups[i].course = { ...course }
  },
  setArchived(state) {
    state.groups[state.activeGroupIndex].active = false
  },
  updateGroupName(state, name) {
    state.groups[state.activeGroupIndex].name = name
  },
}
