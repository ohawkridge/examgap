const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const feedback = data.feedback
  const secret = data.secret
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
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
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
