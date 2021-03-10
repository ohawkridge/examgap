// Utility class for managing document stream
// https://fauna.com/blog/using-faunas-streaming-feature-to-build-a-chat-with-svelte
export default class FaunaStream {
  constructor(client, documentRef, commit) {
    this.documentRef = documentRef
    this.client = client
    this.commit = commit
  }

  initStream() {
    this.stream = this.client.stream.document(this.documentRef)

    this.stream.on('start', (data, event) => {
      console.log(`🏁 Stream started`)
    })

    this.stream.on('version', ({ document: { data } }, event) => {
      console.log(`🆕 Version`, data)
      if ('examMode' in data) {
        // N.B. Can't manipulate state outside mutations
        this.commit('setExamMode', data.examMode)
      }
      // TODO commit new ass
      // But, old 'new' ass triggers this...
      if ('newAssignment' in data) {
        console.log(`NEW ASSIGNMENT`)
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
