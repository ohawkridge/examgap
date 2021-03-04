const faunadb = require('faunadb')
const q = faunadb.query

// configure fauna client with login secret
const client = new faunadb.Client({
  secret: process.env.SECRET_KEY,
})

// Try for a secret token with user's credentials
exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  // Use login key to try credentials
  try {
    const { secret } = await client.query(
      q.Let(
        {
          obj: q.Login(q.Match(q.Index('user_by_username'), data.username), {
            password: data.password,
            ttl: q.TimeAdd(q.Now(), 7, 'days'),
          }),
        },
        {
          secret: q.Select('secret', q.Var('obj')),
          teacher: q.Select(
            ['data', 'teacher'],
            q.Get(q.Select('instance', q.Var('obj')))
          ),
          test: 'djkdjfkjdk',
        }
      )
    )
    return {
      statusCode: 200,
      body: JSON.stringify({ secret }),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
