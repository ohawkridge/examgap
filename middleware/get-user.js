// Middleware called for pages using app.vue layout
export default function ({ store, redirect }) {
  // Check for new assignments after 5 mins.
  if (
    !store.state.user.teacher &&
    store.state.user.lastFetch !== undefined &&
    Date.now() - store.state.user.lastFetch > 300000
  ) {
    return store.dispatch('user/getUser')
  }
  return true
}
