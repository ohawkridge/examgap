export default function ({ store, redirect }) {
  // This middleware is called for all pages using app.vue layout
  // Prevent unauthorised users accessing internal pages
  // We can't check for the presence of a store value
  // as these won't exist during a hard page refresh
  // N.B. localStorage not available server-side
  if (process.browser && localStorage.getItem('examgap') === null) {
    console.warn('NOT LOGGED IN') //  NOT WORKING
    return redirect('/signin')
  }
  // For students, check for new assignments after 5 mins.
  if (
    !store.state.user.teacher &&
    store.state.user.lastFetch !== undefined &&
    Date.now() - store.state.user.lastFetch > 300000
  ) {
    return store.dispatch('user/getUser')
  }
  return true
}
