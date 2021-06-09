// Middleware for all app.vue pages
export default function ({ store, redirect }) {
  // Client-side check for localStorage key
  if (process.client) {
    if (localStorage.getItem('examgap') === null) {
      console.log('%c' + 'You must be logged in (client-side)', 'color:red')
      return redirect('/signin')
    }
  }
  // Server-side check store (unless loading)
  if (process.server) {
    if (!store.state.user.loading && store.state.user.id === '') {
      console.log('%c' + 'You must be logged in (server-side)', 'color:red')
      return redirect('/signin')
    }
  }
}
