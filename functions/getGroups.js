const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Let(
      {
        user: q.Get(q.CurrentIdentity()), // User
      },
      q.If(
        q.Select(['data', 'teacher'], q.Var('user')),
        // If Teacher
        q.Let(
          {
            instance: q.Var('user'),
          },
          {
            groups: q.Select(
              ['data'],
              q.Map(
                q.Paginate(
                  q.Match(
                    q.Index('teacher_groups_2'),
                    q.Select(['ref'], q.Var('instance'))
                  )
                ),
                q.Lambda(
                  'ref',
                  q.Let(
                    {
                      instance: q.Get(q.Var('ref')), // A group
                    },
                    {
                      id: q.Select(['id'], q.Var('ref')),
                      name: q.Select(['data', 'name'], q.Var('instance')),
                      active: q.Select(['data', 'active'], q.Var('instance')),
                      num_students: q.Count(
                        q.Match(
                          q.Index('group_students'),
                          q.Select('ref', q.Var('instance'))
                        )
                      ),
                      course: q.Let(
                        {
                          instance: q.Get(
                            q.Select(['data', 'course'], q.Var('instance'))
                          ),
                        },
                        {
                          id: q.Select(['ref', 'id'], q.Var('instance')),
                          name: q.Select(['data', 'name'], q.Var('instance')),
                          board: q.Select(['data', 'board'], q.Var('instance')),
                          qan: q.Select(['data', 'qan'], q.Var('instance')),
                          boundaries: q.Select(
                            ['data', 'boundaries'],
                            q.Var('instance'),
                            {}
                          ),
                        }
                      ),
                    }
                  )
                )
              )
            ),
          }
        ),
        // If Student
        q.Let(
          {
            instance: q.Var('user'), // User
          },
          {
            groups: q.Select(
              ['data'],
              q.Reverse(
                q.Map(
                  q.Paginate(
                    q.Match(
                      // New index returns groups in reverse order by
                      // timestamp so most recent group is first
                      q.Index('student_groups_2'),
                      q.Select('ref', q.Var('instance'))
                    )
                  ),
                  q.Lambda(
                    // gRef is an array [ts, <group-Ref>]
                    'gRef',
                    q.Let(
                      {
                        instance: q.Get(q.Select([1], q.Var('gRef'))), // Group
                      },
                      {
                        id: q.Select(['ref', 'id'], q.Var('instance')),
                        name: q.Select(['data', 'name'], q.Var('instance')),
                        active: q.Select(['data', 'active'], q.Var('instance')),
                        course: q.Let(
                          {
                            cInstance: q.Get(
                              q.Select(['data', 'course'], q.Var('instance'))
                            ),
                          },
                          {
                            id: q.Select(['ref', 'id'], q.Var('cInstance')),
                            name: q.Select(
                              ['data', 'name'],
                              q.Var('cInstance')
                            ),
                            board: q.Select(
                              ['data', 'board'],
                              q.Var('cInstance')
                            ),
                          }
                        ),
                      }
                    )
                  )
                )
              )
            ),
          }
        )
      )
    )
    const data = await keyedClient.query(qry)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
