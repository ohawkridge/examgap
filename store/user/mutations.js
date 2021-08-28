export default {
  setUser(state, data) {
    // Common properties
    state.id = data.id
    state.username = data.username
    state.secret = data.secret
    state.teacher = data.teacher
    // Teacher/student properties
    if (data.teacher) {
      state.subscriptionDays = data.subscriptionDays
      state.school = data.school
      state.subscribed = data.subscribed
      state.subscriptionExpires = data.subscriptionExpires
    } else {
      state.examMode = data.examMode
    }
  },
  setGroups(state, groups) {
    state.groups = groups
  },
  setActiveGroupId(state, id) {
    // When a new class is created, TheCreateClassDialog sends -1
    // If so, set the most recent group (last in array) as active
    if (id === -1) {
      id = state.groups[state.groups.length - 1].id
    }
    state.activeGroupId = id
  },
  // Update count of students in class
  // (E.g., if student added/copied/removed)
  setCount(state, count) {
    // Find the active group
    // (saves passing in groupId as an extra parameter)
    const i = state.groups.findIndex((g) => g.id === state.activeGroupId)
    // Update the count
    state.groups[i].count = count
  },
  setGroupName(state, name) {
    const i = state.groups.findIndex((g) => g.id === state.activeGroupId)
    state.groups[i].name = name
  },
  addGroup(state, group) {
    state.groups.push(group)
  },
  setQuote(state, quote) {
    state.quote = quote
  },
  setExamMode(state, val) {
    state.examMode = val
  },
  setRevisionExamMode(state, val) {
    state.reviseExamMode = val
  },
  addAssignment(state, assignment) {
    const i = state.groups.findIndex((g) => g.id === state.activeGroupId)
    // Add assignment to *front* of assignments array
    state.groups[i].assignments.unshift({
      dateDue: assignment.data.dateDue,
      id: assignment.ref['@ref'].id,
      name: assignment.data.name,
      start: assignment.data.start,
    })
  },
  deleteAssignment(state, assignmentId) {
    const i = state.groups.findIndex((g) => g.id === state.activeGroupId)
    const assignments = state.groups[i].assignments
    const j = assignments.findIndex((a) => a.id === assignmentId)
    assignments.splice(j, 1)
  },
  setNameAndCourse(state, { name, course }) {
    const i = state.groups.findIndex((g) => g.id === state.activeGroupId)
    state.groups[i].name = name
    state.groups[i].course = { ...course }
  },
  setArchived(state) {
    const i = state.groups.findIndex((g) => g.id === state.activeGroupId)
    state.groups[i].active = false
  },
}
