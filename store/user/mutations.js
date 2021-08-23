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
}
