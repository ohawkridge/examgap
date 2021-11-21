import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: 'examgap',
    paths: ['user', 'app', 'topics', 'assignment', 'group'],
  })(store)
}
