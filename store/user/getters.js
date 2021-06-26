const getters = {
  activeGroup: (state) => {
    return state.groups[state.activeGroupIndex]
  },
  activeGroupCount: (state) => {
    return state.groups.filter((group) => group.active || state.teacher).length
  },
  // TODO Only used in CopyStudents
  // groupsForSelect: (state) => {
  //   return state.groups.map((group) => {
  //     const obj = {
  //       text: group.name,
  //       value: group.id,
  //     }
  //     return obj
  //   })
  // },
}
export default getters
