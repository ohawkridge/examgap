const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const username = data.email
  const code = data.code
  const password = data.password
  // Configure client using login token
  const keyedClient = new faunadb.Client({
    secret: process.env.SECRET_KEY,
  })
  try {
    const qry = q.If(
      q.Exists(q.Match(q.Index('user_by_username'), username)),
      false,
      q.Do(
        // Create student account
        q.Create(q.Collection('User'), {
          data: {
            username: q.LowerCase(username),
            created: q.Now(),
            subscriptionExpires: 'N/A',
            teacher: false,
          },
          credentials: {
            password,
          },
        }),
        // If code provided, map student into class
        q.If(
          q.Equals(code, ''),
          {},
          q.If(
            q.Exists(q.Match(q.Index('group_by_code'), code)),
            q.Create(q.Collection('GroupStudent'), {
              data: {
                student: q.Select(
                  'ref',
                  q.Get(q.Match(q.Index('user_by_username'), username))
                ),
                group: q.Select(
                  'ref',
                  q.Get(q.Match(q.Index('group_by_code'), code))
                ),
              },
            }),
            {}
          )
        )
      )
    )
    const data = await keyedClient.query(qry)
    console.log(data)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
