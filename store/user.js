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
      // Avoid 'only absolute URLs are supported' error
      // https://github.com/node-fetch/node-fetch/issues/481
      const url = new URL(
        '/.netlify/functions/getUser',
        'http://localhost:8888'
      )
      const response = await fetch(url, {
        body: JSON.stringify({
          secret: state.secret,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error fetching user data ${response.status}`)
      }
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
      }
      // Commit group data to the groups store
      commit('groups/setGroups', userData.groups, { root: true })
      // Commit the rest to this store
      commit('setUser', userData)
    } catch (e) {
      console.error(e)
    }
  },
  // Start a document stream on user doc
  async startStream({ state }) {
    const url = new URL(
      '/.netlify/functions/startStream',
      'http://localhost:8888'
    )
    let response = await fetch(url, {
      body: JSON.stringify({
        secret: state.secret,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error starting stream ${response.status}`)
    }
    response = await response.json()
    console.log(response)
    // if ('newAssignment' in data.document.data) {
    //   try {
    //     const assignment = await getNewAssignment(
    //       data.document.data.newAssignment
    //     )
    //     this.$snack.showMessage({
    //       type: '',
    //       msg: 'New assignment added',
    //     })
    //     this.$store.commit('user/newAssignment', assignment)
    //   } catch (e) {
    //     console.error(e)
    //   }
    // }
    // this.$store.commit('user/setExamMode', data.document.data.examMode)
  },
}

export const mutations = {
  setSecret(state, secret) {
    state.secret = secret
  },
  setUser(state, data) {
    // Store common properties
    state.id = data.id
    state.username = data.username
    state.subscriptionExpires = data.subscriptionExpires
    state.teacher = data.teacher
    // Store user-specific properties
    if (data.teacher) {
      state.school = data.school
    } else {
      state.examMode = data.examMode
      state.quote = data.quote.text
    }
  },
  setRevisionExamMode(state, val) {
    state.reviseExamMode = val
  },
  // N.B. Clearing localStorage isn't enough
  // Vue will still live in memory
  logout(state) {
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
