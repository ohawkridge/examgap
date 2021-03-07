const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const students = data.students
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Map(
      students,
      q.Lambda(
        'obj',
        q.Update(
          q.Ref(q.Collection('User'), q.Select('id', q.Var('obj')), {
            credentials: {
              password: 'pw',
            },
          })
        )
      )
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
