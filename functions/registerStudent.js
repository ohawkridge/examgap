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
  console.log(`♦︎`, username, `joining...`)
  console.log(`♦︎ Code:`, code)
  try {
    // Create new student account
    let qry = q.Create(q.Collection('User'), {
      data: {
        username: q.LowerCase(username),
        created: q.Now(),
        teacher: false,
      },
      credentials: {
        password,
      },
    })
    const newUser = await keyedClient.query(qry)
    console.log(`♦︎ Created user`)
    console.log(newUser)
    qry = q.Exists(q.Match(q.Index('group_by_code'), code))
    const groupExists = await keyedClient.query(qry)
    console.log(`♦︎ Group exists?`, groupExists)
    // Need group in order to add student and assignment mappings
    if (groupExists && code !== '') {
      qry = q.Do(
        q.Create(q.Collection('GroupStudent'), {
          data: {
            student: newUser.ref,
            group: q.Select(
              'ref',
              q.Get(q.Match(q.Index('group_by_code'), code))
            ),
          },
        }),
        q.Foreach(
          q.Paginate(
            q.Match(
              q.Index('group_assignments'),
              q.Select('ref', q.Get(q.Match(q.Index('group_by_code'), code)))
            ),
            {
              size: 999,
            }
          ),
          q.Lambda(
            'ref',
            q.Create(q.Collection('AssignmentStudent'), {
              data: {
                assignment: q.Var('ref'),
                student: newUser.ref,
              },
            })
          )
        )
      )
    }
    const data = await keyedClient.query(qry)
    console.log(`♦︎ Mappings data...`)
    console.log(data)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
