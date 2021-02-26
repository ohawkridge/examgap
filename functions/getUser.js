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
            id: q.Select(['ref', 'id'], q.Var('instance')),
            username: q.Select(['data', 'username'], q.Var('instance'), null),
            // User may or may not have a school (e.g. private tutor)
            // Also, school is initially just a string
            school: q.If(
              q.IsRef(q.Select(['data', 'school'], q.Var('instance'))),
              q.Select(
                ['data', 'name'],
                q.Get(q.Select(['data', 'school'], q.Var('instance')))
              ),
              q.Select(['data', 'school'], q.Var('instance'))
            ),
            teacher: true,
            // This is now based on Fauna Time + TimeAdd
            subscriptionExpires: q.Select(
              ['data', 'subscriptionExpires'],
              q.Var('instance')
            ),
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
                          colour: q.Select(
                            ['data', 'colour'],
                            q.Var('instance')
                          ),
                          boundaries: q.Select(
                            ['data', 'boundaries'],
                            q.Var('instance'),
                            {}
                          ),
                        }
                      ),
                      assignments: q.Select(
                        'data',
                        q.Reverse(
                          q.Map(
                            q.Paginate(
                              q.Match(
                                q.Index('group_assignments'),
                                q.Var('ref')
                              )
                            ),
                            q.Lambda(
                              'ref',
                              q.Let(
                                {
                                  instance: q.Get(q.Var('ref')), // Assignment
                                },
                                {
                                  id: q.Select(
                                    ['ref', 'id'],
                                    q.Var('instance')
                                  ),
                                  name: q.Select(
                                    ['data', 'name'],
                                    q.Var('instance')
                                  ),
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
          }
        ),
        // If Student
        q.Let(
          {
            instance: q.Var('user'), // User
          },
          {
            id: q.Select(['ref', 'id'], q.Var('instance')),
            username: q.Select(['data', 'username'], q.Var('instance'), null),
            examMode: q.Select(['data', 'examMode'], q.Var('instance'), true),
            teacher: false,
            quote: q.Let(
              {
                instance: q.Get(
                  q.Select(
                    ['data', 0],
                    q.Paginate(q.Documents(q.Collection('Quote')), {
                      size: 1,
                      after: q.Floor(
                        q.Divide(
                          q.Multiply(
                            Math.random(),
                            q.Count(q.Documents(q.Collection('Quote')))
                          ),
                          64
                        )
                      ),
                    })
                  )
                ),
              },
              {
                text: q.Concat([
                  q.Select(['data', 'quote'], q.Var('instance')),
                  '—',
                  q.Select(['data', 'author'], q.Var('instance')),
                ]),
              }
            ),
            groups: q.Select(
              ['data'],
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
                          instance: q.Get(
                            q.Select(['data', 'course'], q.Var('instance'))
                          ), // Course
                        },
                        {
                          id: q.Select(['ref', 'id'], q.Var('instance')),
                          name: q.Select(['data', 'name'], q.Var('instance')),
                          board: q.Select(['data', 'board'], q.Var('instance')),
                        }
                      ),
                      // Empty array we'll push assignments into client-side
                      assignments: [],
                    }
                  )
                )
              )
            ),
            assignments: q.Reverse(
              q.Select(
                ['data'],
                q.Map(
                  q.Paginate(
                    q.Match(
                      q.Index('student_assignments'),
                      q.Select(['ref'], q.Var('instance')) // User (student)
                    )
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
                        // Is the assignment 'live'?
                        // How many days until the due date?
                        live: q.TimeDiff(
                          q.ToDate(q.Now()),
                          q.Date(
                            q.SubString(
                              q.Select(['data', 'dateDue'], q.Var('instance')),
                              0,
                              10
                            )
                          ),
                          'days'
                        ),
                        questions: q.Select(
                          ['data', 'questions'],
                          q.Var('instance')
                        ),
                        group: q.Select(
                          ['id'],
                          q.Select(['data', 'group'], q.Var('instance'))
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
  } catch (e) {
    return { statusCode: 500, body: e.toString() }
  }
}
