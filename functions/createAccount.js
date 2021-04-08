const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const username = data.username
  const groupId = data.groupId
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    // Check if username already exists
    const qry = q.If(
      q.Exists(q.Match(q.Index('user_by_username'), username)),
      false,
      q.Let(
        {
          instance: q.Create(q.Collection('User'), {
            credentials: { password: 'password' },
            data: {
              username,
              examMode: true,
              teacher: false,
            },
          }),
        },
        q.Create(q.Collection('GroupStudent'), {
          data: {
            student: q.Select('ref', q.Var('instance')),
            group: q.Ref(q.Collection('Group'), groupId),
          },
        })
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
