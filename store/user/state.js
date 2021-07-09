const state = () => ({
  // Common properties
  id: '',
  username: '',
  secret: '',
  teacher: false,
  groups: [],
  activeGroupIndex: 0,
  subscriptionDays: 'N/A', // Easier to calculate in Fauna
  // Teacher properties
  school: 'N/A',
  subscribed: false,
  subscriptionExpires: '',
  // Student properties
  examMode: false,
  reviseExamMode: false,
  quote: 'Experiment, fail, learn, repeat.—Anonymous',
  students: [], // _students.vue
})

export default state
