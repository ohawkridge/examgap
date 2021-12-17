const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const username = data.username
  const password = data.password
  const ctx = process.env.CONTEXT
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
          // https://docs.fauna.com/fauna/current/api/fql/functions/login?lang=javascript
          // Returns auth object
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
          user: q.Merge(q.Var('usr'), [
            {
              id: q.Select(['instance', 'id'], q.Var('obj')),
              secret: q.Select('secret', q.Var('obj')),
            },
            q.If(
              q.Select('teacher', q.Var('usr')),
              {
                school: q.If(
                  q.IsRef(q.Select('school', q.Var('usr'))),
                  q.Select(
                    ['data', 'name'],
                    q.Get(q.Select('school', q.Var('usr')))
                  ),
                  q.Select('school', q.Var('usr'))
                ),
                subscriptionExpires: q.Select(
                  'subscriptionExpires',
                  q.Var('usr')
                ),
                subscriptionDays: q.TimeDiff(
                  q.Now(),
                  q.Select('subscriptionExpires', q.Var('usr')),
                  'days'
                ),
                groups: q.Select(
                  'data',
                  q.Map(
                    q.Paginate(
                      q.Match(
                        q.Index('teacher_groups_3'),
                        q.Select('instance', q.Var('obj')),
                        true
                      )
                    ),
                    q.Lambda(
                      'ref',
                      q.Let(
                        {
                          instance: q.Get(q.Var('ref')), // Group
                        },
                        {
                          id: q.Select(['id'], q.Var('ref')),
                          name: q.Select(['data', 'name'], q.Var('instance')),
                          active: q.Select(
                            ['data', 'active'],
                            q.Var('instance')
                          ),
                          code: q.Select(['data', 'code'], q.Var('instance')),
                          numStudents: q.Count(
                            q.Match(
                              q.Index('group_students'),
                              q.Select('ref', q.Var('instance'))
                            )
                          ),
                          course: q.Call(
                            q.Function('GetCourse'),
                            q.Select(['data', 'course'], q.Var('instance'))
                          ),
                        }
                      )
                    )
                  )
                ),
              },
              {
                groups: q.Select(
                  'data',
                  q.Map(
                    q.Paginate(
                      q.Match(
                        q.Index('student_groups_2'),
                        q.Select('instance', q.Var('obj'))
                      )
                    ),
                    q.Lambda(
                      'ref',
                      q.Let(
                        {
                          instance: q.Get(q.Select([1], q.Var('ref'))), // Group
                        },
                        {
                          id: q.Select(['ref', 'id'], q.Var('instance')),
                          name: q.Select(['data', 'name'], q.Var('instance')),
                          course: q.Call(
                            q.Function('GetCourse'),
                            q.Select(['data', 'course'], q.Var('instance'))
                          ),
                        }
                      )
                    )
                  )
                ),
              }
            ),
          ]),
        }
      )
    )
    const data = await client.query(qry)
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
