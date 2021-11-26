const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const students = data.students
  const password = data.password
  const secret = data.secret
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Map(
      students,
      q.Lambda(
        'id',
        q.Update(q.Ref(q.Collection('User'), q.Var('id')), {
          credentials: {
            password,
          },
        })
      )
    )
    await keyedClient.query(qry)
    return {
      statusCode: 200,
      body: 'ok',
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
