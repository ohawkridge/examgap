import Vue from 'vue'

Vue.filter('pluralize', function (count) {
  return count === 1 ? '' : 's'
})

Vue.filter('date', function (dateStr) {
  // Old assignments don't have start date !!
  if (dateStr === 'N/A' || dateStr === '-') {
    return 'N/A'
  }
  const date = new Date(dateStr)
  return date.toString().substring(0, 15)
})

Vue.filter('strip', function (html) {
  return html.replace(/<[^>]*>?/gm, '')
})
