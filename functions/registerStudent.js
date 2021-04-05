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
  try {
    // Create new student account (if not already exists)
    let qry = q.If(
      q.Exists(q.Match(q.Index('user_by_username'), username)),
      false,
      q.Create(q.Collection('User'), {
        data: {
          username: q.LowerCase(username),
          created: q.Now(),
          teacher: false,
          examMode: true,
        },
        credentials: {
          password,
        },
      })
    )
    const newUser = await keyedClient.query(qry)
    if (newUser !== false) {
      qry = q.Exists(q.Match(q.Index('group_by_code'), code))
      const groupExists = await keyedClient.query(qry)
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
      await keyedClient.query(qry)
    }
    return {
      statusCode: 200,
      body: JSON.stringify(newUser),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
