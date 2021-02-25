export default function ({ store }) {
  console.log('Middleware checking for user...')
  // If user doesn't exist, fetch their data
  // This is called for all pages using app.vue layout
  if (!store.state.user.id || store.state.user.id === '') {
    console.log('No user found')
    console.log('Middleware dispatching user/getUser...')
    return store.dispatch('user/getUser')
  }
  return true
}
