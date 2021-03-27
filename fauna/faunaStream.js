// Utility class for managing document stream
// https://fauna.com/blog/using-faunas-streaming-feature-to-build-a-chat-with-svelte
export default class FaunaStream {
  constructor(client, documentRef, commit, dispatch) {
    this.documentRef = documentRef
    this.client = client
    this.commit = commit
    this.dispatch = dispatch
  }

  initStream() {
    this.stream = this.client.stream.document(this.documentRef, {
      fields: ['diff'],
    })

    this.stream.on('start', (data, event) => {
      console.log(
        '%c' + 'GO',
        'padding:2px 4px;background-color:green;color:white;border-radius:3px'
      )
      console.log('Stream started')
    })

    this.stream.on('version', ({ diff: { data } }, event) => {
      if ('examMode' in data) {
        // N.B. Can't manipulate state outside mutations
        this.commit('setExamMode', data.examMode)
      }
      if ('newAssignment' in data) {
        // Dispatch an action to get assignment details
        this.dispatch('getAssignment', data.newAssignment)
      }
    })

    this.stream.on('error', (data, event) => {
      console.error(`Stream error`, data)
      this.stream.close()
      setTimeout(() => {
        this.initStream()
      }, 250)
    })

    this.stream.start()
  }

  destroy() {
    this.stream.close()
  }
}
