export const state = () => ({
  state: {
    secret: '',
  },
})

export const actions = {
  nuxtServerInit(vuexContext, context) {
    console.log(`-> nuxtServerInit called`)
  },
  // Call a function to get user data
  async getUser({ commit, state }) {
    console.log('getUser store action was dispatched')
    try {
      const response = await fetch('/.netlify/functions/getUserSecret', {
        body: JSON.stringify({
          username: this.username,
          password: this.pw,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error fetching user data ${response.status}`)
      } else {
        console.log('USER DATA')
        console.log(response)
        // Merge values into store
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
}
