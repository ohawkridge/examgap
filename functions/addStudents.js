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
          false,
          q.Let(
            {
              instance: q.Create(q.Collection('User'), {
                credentials: { password: 'password' },
                data: {
                  username: q.Var('name'),
                  created: q.Now(),
                  examMode: true,
                  teacher: false,
                  createdBy: q.CurrentIdentity(),
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
    const data = await keyedClient.query(qry)
    // console.log(data)
    // Usernames is an array.∴ we get an array back
    // false in array if username exists, otherwise
    // object containing student ref, ts, and data
    // E.g., [false, false, { ref:.., ts:.., data: {} }, {..}]
    return { statusCode: 200, body: JSON.stringify(data) }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
