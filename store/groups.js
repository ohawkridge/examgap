export const state = () => ({
  groups: [],
})

export const actions = {
  async nuxtServerInit({ commit }, context) {
    console.log(`-> nuxtServerInit GROUPS`)
    try {
      const response = await fetch('/.netlify/functions/getGroups', {
        body: JSON.stringify({
          secret: context.rootState.instance.user.secret,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error fetching groups ${response.status}`)
      } else {
        // Call mutation to update state
        const groups = await response.json()
        console.log(`nuxtServerInit got`, groups)
        commit('setGroups', groups)
      }
    } catch (e) {
      console.error(e)
    }
  },
}

export const mutations = {
  setGroups(state, groups) {
    state.groups = groups
  },
}
