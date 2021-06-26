const state = () => ({
  // Common properties
  id: '',
  username: '',
  secret: '',
  teacher: false,
  groups: [],
  activeGroupIndex: 0,
  // Teacher properties
  school: 'N/A',
  subscribed: false,
  subscriptionExpires: '',
  // Student properties
  examMode: false,
  reviseExamMode: false,
  quote: 'Experiment, fail, learn, repeat.—Anonymous',
})

export default state
