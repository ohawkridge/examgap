const getters = {
  activeGroup: (state) => {
    return state.groups[state.activeGroupIndex]
  },
  activeGroupCount: (state) => {
    return state.groups.filter((group) => group.active).length
  },
  assignments: (state, getters) => {
    // Filter out post-dated assignments
    if (!getters.activeGroup) return []
    return getters.activeGroup.assignments.filter(
      (assignment) =>
        assignment.start === 'N/A' || new Date(assignment.start) <= new Date()
    )
  },
}
export default getters
