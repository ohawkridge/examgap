const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const stream = await keyedClient.stream
      .document(
        q.Ref(q.Collection('User'), q.Select('id', q.CurrentIdentity()))
      )
      .on('start', () => {
        console.log(`Stream START`)
      })
      .on('version', (data, event) => {
        console.log(`Stream ${event.type} event`)
        return {
          statusCode: 200,
          body: JSON.stringify(data),
        }
      })
      .on('error', (data, event) => {
        console.log(`Stream ERROR`)
        console.error(data, event)
      })
    stream.start()
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
