import Vue from 'vue'

Vue.filter('pluralize', function (count) {
  return count === 1 ? '' : 's'
})

Vue.filter('date', function (dateStr) {
  // Old assignments don't have start date !!
  // _report.vue crashed once when dateStr was undefined
  if (dateStr === 'N/A' || dateStr === '-' || dateStr === undefined) {
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
  // Supposedly safer than regex
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
  // return html.replace(/<[^>]*>?/gm, '')
})

// For email usernames, shorten to just
// the portion before the '@' sign
Vue.filter('name', function (username) {
  return username.includes('@')
    ? username.substring(0, username.indexOf('@'))
    : username
})
