export const state = () => ({
  id: '',
  username: '',
  secret: '',
  school: '',
  teacher: false,
  subscriptionExpires: '',
  examMode: false,
  reviseExamMode: false,
})

export const actions = {
  nuxtServerInit(vuexContext, context) {
    console.log(`-> nuxtServerInit called`)
  },
  // Call a function to get user data
  async getUser({ commit, state }) {
    try {
      const response = await fetch('/.netlify/functions/getUser', {
        body: JSON.stringify({
          secret: state.secret,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error fetching user data ${response.status}`)
      } else {
        // Call mutation to update state
        const userData = await response.json()
        commit('user/setUser', userData)
      }
    } catch (e) {
      console.error(e)
    }
  },
}

export const mutations = {
  setSecret(state, secret) {
    state.secret = secret
  },
  setUser(state, data) {
    // Merge teacher properties into store
    state.id = data.id
    state.username = data.username
    state.school = data.school
    state.teacher = data.teacher
    state.subscriptionExpires = data.subscriptionExpires
  },
}
