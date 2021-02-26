import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'examgap',
      paths: ['user', 'groups', 'assignments'],
    })(store)
  })
}
