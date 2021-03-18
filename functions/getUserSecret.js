const faunadb = require('faunadb')
const q = faunadb.query

// configure fauna client with login secret
const client = new faunadb.Client({
  secret: process.env.SECRET_KEY,
})

// Try for a secret token with user's credentials
exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  try {
    const res = await client.query(
      q.Let(
        {
          // Use login key to try for credentials
          obj: q.Login(
            q.Match(q.Index('user_by_username'), q.LowerCase(data.username)),
            {
              password: data.password,
              ttl: q.TimeAdd(q.Now(), 7, 'days'),
            }
          ),
        },
        {
          // We need to know whether the user is a teacher
          // to send them to the right home page
          secret: q.Select('secret', q.Var('obj')),
          teacher: q.Select(
            ['data', 'teacher'],
            q.Get(q.Select('instance', q.Var('obj')))
          ),
        }
      )
    )
    return {
      statusCode: 200,
      body: JSON.stringify(res),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
