const getters = {
  activeGroup: (state) => {
    return state.groups[state.activeGroupIndex]
  },
  activeGroupCount: (state) => {
    return state.groups.filter((group) => group.active).length
  },
  assignments: (state, getters) => {
    if (!getters.activeGroup) return []
    return getters.activeGroup.assignments.filter(
      (assignment) =>
        // Filter out post-dated assignments
        assignment.start === 'N/A' || new Date(assignment.start) <= new Date()
    )
  },
  // Return a list of the user's groups formatted for v-select
  selectGroups: (state, getters) => {
    const groups = state.groups.map((group) => {
      const obj = {
        text: group.name,
        value: group.id,
      }
      return obj
    })
    // Filter out the current group
    return groups.filter((g) => g.value !== getters.activeGroup.id)
  },
}
export default getters
