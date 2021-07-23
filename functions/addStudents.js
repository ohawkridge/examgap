const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const usernames = data.usernames
  const groupId = data.groupId
  const secret = data.secret
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Map(
      usernames,
      q.Lambda(
        'name',
        q.If(
          // Check if username already exists
          q.Exists(q.Match(q.Index('user_by_username'), q.Var('name'))),
          {},
          q.Let(
            {
              instance: q.Create(q.Collection('User'), {
                credentials: { password: 'password' },
                data: {
                  username: q.Var('name'),
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
      )
    )
    await keyedClient.query(qry)
    return {
      statusCode: 200,
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
