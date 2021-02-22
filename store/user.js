export const state = () => ({
  id: '',
  username: '',
  secret: '',
  school: '',
  teacher: false,
  subscriptionExpires: '',
  examMode: false,
  reviseExamMode: false,
  quote: 'Experiment, fail, learn, repeat.—Anonymous',
})

export const actions = {
  nuxtServerInit(vuexContext, context) {
    console.log(`-> nuxtServerInit USER`)
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
        commit('setUser', userData)
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
    // Merge common properties into store
    state.id = data.id
    state.username = data.username
    state.subscriptionExpires = data.subscriptionExpires
    state.teacher = data.teacher
    // Teacher-specific properties
    if (data.teacher) {
      state.school = data.school
      // Student-specific properties
    } else {
      state.examMode = data.examMode
      state.quote = data.quote.text
    }
  },
}
