const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const secret = data.secret
  const teacher = data.teacher
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.If(
      teacher,
      // **TEACHER**
      q.Select(
        'data',
        q.Map(
          q.Paginate(q.Match(q.Index('teacher_groups_2'), q.CurrentIdentity())),
          q.Lambda(
            'ref',
            q.Let(
              {
                instance: q.Get(q.Var('ref')), // Group
              },
              {
                id: q.Select(['id'], q.Var('ref')),
                name: q.Select(['data', 'name'], q.Var('instance')),
                active: q.Select(['data', 'active'], q.Var('instance')),
                code: q.Select(['data', 'code'], q.Var('instance')),
                count: q.Count(
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
                    rag: q.Select(['data', 'rag'], q.Var('instance')),
                  }
                ),
                assignments: q.Select(
                  'data',
                  q.Reverse(
                    q.Map(
                      q.Paginate(
                        q.Match(q.Index('group_assignments'), q.Var('ref'))
                      ),
                      q.Lambda(
                        'ref',
                        q.Let(
                          {
                            instance: q.Get(q.Var('ref')), // Assignment
                          },
                          {
                            id: q.Select(['ref', 'id'], q.Var('instance')),
                            name: q.Select(['data', 'name'], q.Var('instance')),
                            start: q.Select(
                              ['data', 'start'],
                              q.Var('instance'),
                              'N/A'
                            ),
                            dateDue: q.Select(
                              ['data', 'dateDue'],
                              q.Var('instance')
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
      ),
      // **STUDENT**
      q.Select(
        ['data', 'data'],
        q.Let(
          {
            assignments: q.Reverse(
              q.Select(
                'data',
                q.Map(
                  q.Paginate(
                    q.Match(q.Index('student_assignments'), q.CurrentIdentity())
                  ),
                  q.Lambda(
                    'ref',
                    q.Let(
                      {
                        instance: q.Get(q.Var('ref')), // Assignment
                      },
                      {
                        id: q.Select(['ref', 'id'], q.Var('instance')),
                        name: q.Select(['data', 'name'], q.Var('instance')),
                        start: q.Select(
                          ['data', 'start'],
                          q.Var('instance'),
                          'N/A'
                        ),
                        dateDue: q.Select(
                          ['data', 'dateDue'],
                          q.Var('instance')
                        ),
                        // Need group to filter assignments later
                        group: q.Select(['data', 'group'], q.Var('instance')),
                        questions: q.Select(
                          ['data', 'questions'],
                          q.Var('instance')
                        ),
                      }
                    )
                  )
                )
              )
            ),
          },
          {
            data: q.Map(
              q.Paginate(
                q.Match(q.Index('student_groups_2'), q.CurrentIdentity())
              ),
              q.Lambda(
                'gRef',
                q.Let(
                  {
                    instance: q.Get(q.Select([1], q.Var('gRef'))), // Group
                  },
                  {
                    id: q.Select(['ref', 'id'], q.Var('instance')),
                    name: q.Select(['data', 'name'], q.Var('instance')),
                    active: q.Select(['data', 'active'], q.Var('instance')),
                    // These come from much higher up! ^^^
                    assignments: q.Filter(
                      q.Var('assignments'),
                      q.Lambda(
                        'ass',
                        q.Equals(
                          q.Select('group', q.Var('ass')),
                          q.Select('ref', q.Var('instance'))
                        )
                      )
                    ),
                    course: q.Let(
                      {
                        instance: q.Get(
                          q.Select(['data', 'course'], q.Var('instance'))
                        ), // Course
                      },
                      {
                        id: q.Select(['ref', 'id'], q.Var('instance')),
                        name: q.Select(['data', 'name'], q.Var('instance')),
                        board: q.Select(['data', 'board'], q.Var('instance')),
                        commands: q.Select(
                          ['data', 'commands'],
                          q.Var('instance'),
                          ''
                        ),
                      }
                    ),
                  }
                )
              )
            ),
          }
        )
      )
    )
    const data = await keyedClient.query(qry)
    // console.log(data)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
