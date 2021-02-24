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
        const userData = await response.json()
        // For students we need to do some 'post processing'
        // to put all the assignments into the right groups
        if (!userData.teacher) {
          for (const assignment of userData.assignments) {
            for (const group of userData.groups) {
              if (group.id === assignment.group) {
                group.assignments.push(assignment)
              }
            }
          }
          // Commit result to groups store
          commit('groups/setGroups', userData.groups, { root: true })
        }
        // Call mutation to commit data in *this* store
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
  // N.B. Clearing localStorage isn't enough
  // Vue will still live in memory
  logout(state) {
    console.log(`Logging you out...`)
    state.id = ''
    state.username = ''
    state.secret = ''
    state.school = ''
    state.teacher = false
    state.subscriptionExpires = ''
    state.examMode = false
    state.reviseExamMode = false
    state.quote = 'Experiment, fail, learn, repeat.—Anonymous'
  },
}
