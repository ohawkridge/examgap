const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const username = data.username
  const school = data.school
  const password = data.password
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: process.env.SECRET_KEY,
  })
  try {
    const qry = q.If(
      q.Exists(q.Match(q.Index('user_by_username'), username)),
      false,
      q.Create(q.Collection('User'), {
        data: {
          school,
          username: q.LowerCase(username),
          created: q.Now(),
          subscriptionExpires: q.TimeAdd(q.Now(), 30, 'days'),
          teacher: true,
        },
        credentials: {
          password,
        },
      })
    )
    const data = await keyedClient.query(qry)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
