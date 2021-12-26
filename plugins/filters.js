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

// Return css class to RAG text elements
Vue.filter('ragText', function (n, max) {
  if (n / max <= 1 / 3) return 'red--text'
  if (n / max > 2 / 3) return 'green--text'
  return 'orange--text'
})

Vue.filter('time', function (sec) {
  if (sec === 0) return 'N/A'
  return `${Math.floor(
    sec / 60
  )}:${String(sec - Math.floor(sec / 60) * 60).padStart(2, '0')}`
})
