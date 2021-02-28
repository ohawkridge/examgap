const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const username = data.username
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    // Check if username already exists
    const qry = q.If(
      q.Exists(q.Match(q.Index('user_by_username'), username)),
      false,
      q.Create(q.Collection('User'), {
        credentials: { password: 'pw' },
        data: {
          username,
          examMode: true,
          teacher: false,
        },
      })
    )
    // TODO Map student to group
    const data = await keyedClient.query(qry)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
