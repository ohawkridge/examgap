const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const username = data.username
  const password = data.password
  const ctx = process.env.CONTEXT
  console.log(`\n==> Environment is`, ctx, '\n')
  // Use ExamgapDev database in development
  const secret = ctx === 'dev' ? process.env.DEV_KEY : process.env.SECRET_KEY
  const client = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Select(
      'user',
      q.Let(
        {
          // Use login secret to try for user credentials
          obj: q.Login(
            q.Match(q.Index('user_by_username'), q.LowerCase(username)),
            {
              password,
              ttl: q.TimeAdd(q.Now(), 14, 'days'),
            }
          ),
          usr: q.Select('data', q.Get(q.Select('instance', q.Var('obj')))),
        },
        {
          user: q.Merge(
            // Object one
            q.Var('usr'),
            // Object two
            // This is the second object passed to Merge
            // function ∴ school value will be replaced
            {
              secret: q.Select('secret', q.Var('obj')),
              id: q.Select(['instance', 'id'], q.Var('obj')),
              // For teachers, look up school if we find a Ref
              // For students, school is 'N/A'
              school: q.If(
                q.Select('teacher', q.Var('usr')),
                q.If(
                  q.IsRef(q.Select('school', q.Var('usr'))),
                  q.Select(
                    ['data', 'name'],
                    q.Get(q.Select('school', q.Var('usr')))
                  ),
                  q.Select('school', q.Var('usr'))
                ),
                'N/A'
              ),
              subscriptionDays: q.If(
                q.Select('teacher', q.Var('usr')),
                q.TimeDiff(
                  q.Now(),
                  q.Select('subscriptionExpires', q.Var('usr')),
                  'days'
                ),
                'N/A'
              ),
            }
          ),
        }
      )
    )
    const data = await client.query(qry)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
