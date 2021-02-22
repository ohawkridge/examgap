export const state = () => ({
  msg: '',
  type: '',
})

export const mutations = {
  showSnack(state, { msg, type }) {
    state.msg = msg
    state.type = type
  },
}
