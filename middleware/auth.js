// Middleware for all app.vue pages
export default function ({ redirect, store }) {
  if (process.browser) {
    console.log('auth.js (client-side)')
  } else {
    console.log('%c' + 'auth.js (server-side)', 'color:red')
  }
  if (!store.state.app.loading && store.state.user.id === '') {
    console.log('%c' + 'You must be logged in', 'color:red')
    redirect('/signin')
  }
}
