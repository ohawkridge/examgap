const faunadb = require('faunadb')
const q = faunadb.query

// configure fauna client with login secret
const client = new faunadb.Client({
  secret: process.env.SECRET_KEY,
})

// Try for a secret token with user's credentials
exports.handler = async (event, context, callback) => {
  console.log(`Attempting login`)
  const data = JSON.parse(event.body)
  console.log(`credentials...`, data)
  // Use login key to try credentials
  try {
    const { secret } = await client.query(
      q.Login(q.Match(q.Index('user_by_username'), data.username), {
        password: data.password,
        ttl: q.TimeAdd(q.Now(), 7, 'days'),
      })
    )
    return {
      statusCode: 200,
      body: JSON.stringify({ secret }),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
