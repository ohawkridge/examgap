const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const username = data.email
  const code = data.code.replace('-', '') // Remove dash if present
  const password = data.password
  // Configure client using login token
  const keyedClient = new faunadb.Client({
    secret: process.env.SECRET_KEY,
  })
  console.log(`♦︎ username`, username, `joining...`)
  console.log(`♦︎ code`, code)
  try {
    const qry = q.If(
      // Account already exists
      q.Exists(q.Match(q.Index('user_by_username'), username)),
      false,
      // Get group + create new account
      q.Let(
        {
          group: q.Select(
            'ref',
            q.Get(q.Match(q.Index('group_by_code'), code))
          ),
          newUser: q.Create(q.Collection('User'), {
            data: {
              username: q.LowerCase(username),
              created: q.Now(),
              teacher: false,
            },
            credentials: {
              password,
            },
          }),
        },
        {
          res: q.If(
            q.Equals(code, ''),
            {},
            q.If(
              // Found group with this code
              q.Exists(q.Match(q.Index('group_by_code'), code)),
              q.Do(
                // Create mapping doc in GroupStudent
                q.Create(q.Collection('GroupStudent'), {
                  data: {
                    student: q.Var('newUser'),
                    group: q.Var('group'),
                  },
                }),
                // For each existing assignment for group
                // create mapping in AssignmentStudent
                q.Foreach(
                  q.Paginate(
                    q.Match(q.Index('group_assignments'), q.Var('group')),
                    {
                      size: 999,
                    }
                  ),
                  q.Lambda(
                    'ref',
                    q.Create(q.Collection('AssignmentStudent'), {
                      data: {
                        assignment: q.Var('ref'),
                        student: q.Var('newUser'),
                      },
                    })
                  )
                )
              ),
              // No group with code
              {}
            )
          ),
        }
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
