const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const feedback = data.feedback
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Create(q.Collection('Feedback'), {
      data: {
        feedback,
        user: q.Concat([
          q.Select(['data', 'username'], q.Get(q.CurrentIdentity())),
          ' (',
          q.Select('id', q.CurrentIdentity()),
          ')',
        ]),
        created: q.Now(),
      },
    })
    const data = await keyedClient.query(qry)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
