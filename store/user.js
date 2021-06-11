import FaunaStream from '../fauna/faunaStream'
const faunadb = require('faunadb')
const q = faunadb.query

export const state = () => ({
  id: '',
  username: '',
  secret: '',
  school: 'N/A',
  teacher: false,
  subscriptionExpires: '',
  subscribed: null,
  examMode: false,
  reviseExamMode: false,
  quote: 'Experiment, fail, learn, repeat.—Anonymous',
  onboardStep: 0, // Don't onboard
  lastFetch: undefined,
  loading: false,
})

export const actions = {
  // Call a function to get user data
  async getUser({ commit, state, dispatch }) {
    // secret is empty during hard refresh
    if (state.secret !== '') {
      try {
        commit('setLoading', true)
        const url = new URL('/.netlify/functions/getUser', this.$config.baseURL)
        const response = await fetch(url, {
          body: JSON.stringify({
            secret: state.secret,
          }),
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(`Error fetching user data ${response.status}`)
        }
        console.log(
          '%c' + 'getUser',
          'padding:2px 4px;background-color:#0078a0;color:white;border-radius:3px'
        )
        const userData = await response.json()
        // Commit user data to store
        commit('setUser', userData)
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
          // Remember when this was stored
          commit('setLastFetch', Date.now())
          // Open doc stream
          dispatch('openStream', userData)
          // Onboard teacher if nec.
        } else if (userData.groups.length === 0 && userData.teacher) {
          commit('setOnboardStep', 1)
        } else {
          // Unlikely, a teacher with no active groups
          let activeFound = false
          for (const group of userData.groups) {
            if (group.active) {
              activeFound = true
              break
            }
          }
          if (!activeFound) commit('setOnboardStep', 1)
        }
        // Commit group data to groups store
        commit('groups/setGroups', userData.groups, { root: true })
      } catch (e) {
        console.error(e)
      } finally {
        commit('setLoading', false)
      }
    }
  },
  // Don't forget first argument is the context
  openStream({ state, commit, dispatch }, { id }) {
    const keyedClient = new faunadb.Client({
      secret: state.secret,
    })
    // Create a Fauna stream object
    const fso = new FaunaStream(
      keyedClient,
      q.Ref(q.Collection('User'), id),
      commit,
      dispatch
    )
    fso.initStream()
    // TODO Destroy on logout
  },
  // Get a new streamed assignment
  // Has to be in this store because we created fso here
  async getAssignment({ commit, rootState }, assignmentId) {
    try {
      const url = new URL(
        '/.netlify/functions/getNewAssignment',
        this.$config.baseURL
      )
      let response = await fetch(url, {
        body: JSON.stringify({
          secret: rootState.user.secret,
          assignmentId,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error fetching new assignment ${response.status}`)
      }
      response = await response.json()
      // Commit mutation in groups store to add assignment
      commit('groups/newAssignment', response, { root: true })
      // Trigger snackbar
      commit(
        'snackbar/showSnack',
        { type: '', msg: 'New assignment set' },
        { root: true }
      )
    } catch (e) {
      console.error(e)
    }
  },
}

export const mutations = {
  setLoading(state, loading) {
    state.loading = loading
  },
  setLastFetch(state, ts) {
    console.log(`-> stale data`, ts)
    state.lastFetch = ts
  },
  setOnboardStep(state, n) {
    state.onboardStep = n
    console.log(
      '%c' + n,
      'padding:2px 4px;background-color:yellow;color:black;border-radius:10px'
    )
  },
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
      state.subscribed = data.subscribed
    } else {
      state.examMode = data.examMode
      state.quote = data.quote.text
    }
  },
  setExamMode(state, val) {
    state.examMode = val
  },
  setRevisionExamMode(state, val) {
    state.reviseExamMode = val
  },
  // N.B. Clearing localStorage isn't enough
  // TODO Vue still in memory
  logout(state) {
    state.id = ''
    state.username = ''
    state.secret = ''
    state.school = ''
    state.teacher = false
    state.subscriptionExpires = ''
    state.subscribed = null
    state.examMode = false
    state.reviseExamMode = false
    state.quote = 'Experiment, fail, learn, repeat.—Anonymous'
    state.onboard = false
    state.onboardStep = 1
    state.lastFetch = undefined
    state.loading = false
  },
}
