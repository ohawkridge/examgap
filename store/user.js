// import { getLoginToken, getUser } from '@/api/'

export const state = () => ({
  state: {
    user: {},
  },
})

export const actions = {
  nuxtServerInit({ commit }, context) {
    // Actually access faunadb
    // const token = await getLoginToken('owen.hawkridge@chauncy.org.uk', 'pw')
    // localStorage.setItem('secret', token)
    // const userData = await getUser()
    commit('setUser', { username: 'Mr Fuckity' })
  },
}

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
}
