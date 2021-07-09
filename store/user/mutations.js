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
  setStudents(state, students) {
    state.students = students
  },
  // Called after copying students
  updateNumStudents(state, copied) {
    state.groups[state.activeGroupIndex].num_students += copied
  },
  // Called after manually adding students
  incrementStudentCount(state) {
    state.groups[state.activeGroupIndex].num_students++
  },
  // Teacher creates a new assignment
  addAssignment(state, assignment) {
    // Add assignment to front of assignments array
    state.groups[state.activeGroupIndex].assignments.unshift({
      dateDue: assignment.data.dateDue,
      id: assignment.ref['@ref'].id,
      name: assignment.data.name,
      start: assignment.data.start,
    })
  },
  deleteAssignment(state, { groupId, assignmentId }) {
    const groupIndex = state.groups.findIndex((g) => g.id === groupId)
    const assignments = state.groups[groupIndex].assignments
    // Let's prefer splice for now to maintain reactivity
    for (let i = 0; i < assignments.length; i++) {
      if (assignments[i].id === assignmentId) {
        assignments.splice(i, 1)
      }
    }
  },
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
    for (let i = 0; i < state.groups.length; i++) {
      if (state.groups[i].id === id) {
        state.groups[i].name = name
        state.groups[i].course = { ...course }
      }
    }
  },
  setArchived(state) {
    state.groups[state.activeGroupIndex].active = false
  },
  updateGroupName(state, { id, name }) {
    for (let i = 0; i < state.groups.length; i++) {
      if (state.groups[i].id === id) {
        state.groups[i].name = name
      }
    }
  },
}
