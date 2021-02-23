export const state = () => ({
  assignments: [],
})

export const actions = {
  getAssignments({ commit, rootState }, payload) {
    try {
      console.log(`getAssignments action w/`, payload)
      // const response = await fetch('/.netlify/functions/getAssignments', {
      //   body: JSON.stringify({
      //     secret: rootState.user.secret,
      //   }),
      //   method: 'POST',
      // })
      // if (!response.ok) {
      //   throw new Error(`Error fetching assignments ${response.status}`)
      // } else {
      //   // Call mutation to update state
      //   const assignments = await response.json()
      //   commit('setAssignments', assignments)
      // }
    } catch (e) {
      console.error(e)
    }
  },
}
