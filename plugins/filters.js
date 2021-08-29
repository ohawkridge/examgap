import Vue from 'vue'

Vue.filter('pluralize', function (count) {
  return count === 1 ? '' : 's'
})

Vue.filter('date', function (dateStr) {
  // Old assignments don't have start date !!
  if (dateStr === 'N/A' || dateStr === '-') {
    return 'N/A'
  }
  // Some old due dates include timezone
  if (dateStr.length > 10) {
    dateStr = dateStr.substring(0, 10)
  }
  const date = new Date(dateStr)
  return date.toString().substring(0, 15)
})

Vue.filter('strip', function (html) {
  return html.replace(/<[^>]*>?/gm, '')
})

// For email usernames, shorten to just
// the portion before the '@' sign
Vue.filter('name', function (username) {
  return username.includes('@')
    ? username.substring(0, username.indexOf('@'))
    : username
})
