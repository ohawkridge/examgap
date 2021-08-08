const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const username = data.email
  const code = data.code.replace('-', '') // Remove dash if present
  const password = data.password
  // Configure client using login token
  const keyedClient = new faunadb.Client({
    secret: process.env.SECRET_KEY,
  })
  try {
    const qry = q.Let(
      {
        // Create new student user doc (if not already exists)
        student: q.If(
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
        ),
        // Get group with code if exists
        group: q.If(
          q.Exists(q.Match(q.Index('group_by_code'), code)),
          q.Select('ref', q.Get(q.Match(q.Index('group_by_code'), code))),
          false
        ),
      },
      {
        output: q.If(
          // Created account and valid code?
          q.And(
            q.Not(q.Equals(q.Var('student'), false)),
            q.Not(q.Equals(q.Var('group'), false))
          ),
          q.Do(
            // Add student to group
            q.Create(q.Collection('GroupStudent'), {
              data: {
                student: q.Select('ref', q.Var('student')),
                group: q.Var('group'),
              },
            }),
            // Map existing assignments onto new student
            q.Map(
              q.Paginate(
                q.Match(q.Index('group_assignments'), q.Var('group')),
                { size: 999 }
              ),
              q.Lambda(
                'ref',
                q.Create(q.Collection('AssignmentStudent'), {
                  data: {
                    assignment: q.Var('ref'),
                    student: q.Select('ref', q.Var('student')),
                  },
                })
              )
            )
          ),
          false
        ),
      }
    )
    const data = await keyedClient.query(qry)
    console.log('-> registerStudent()')
    console.log(data)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
