export default function ({ store }) {
  // If user doesn't exist, fetch their data
  // This is called for all pages using app.vue layout
  if (!store.state.user.id || store.state.user.id === '') {
    return store.dispatch('user/getUser')
  }
  return true
}
