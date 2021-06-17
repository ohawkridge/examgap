// Middleware for all app.vue pages
export default function ({ redirect, store }) {
  if (!store.state.user.loading && store.state.user.id === '') {
    console.log('%c' + 'You must be logged in', 'color:red')
    redirect('/signin')
  }
}
