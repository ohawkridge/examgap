const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const assignmentId = data.assignmentId
  const secret = data.secret
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Let(
      {
        instance: q.Get(q.Ref(q.Collection('Assignment'), assignmentId)), // Assignment
      },
      {
        id: q.Select(['ref', 'id'], q.Var('instance')),
        name: q.Select(['data', 'name'], q.Var('instance')),
        start: q.Select(['data', 'start'], q.Var('instance'), 'N/A'),
        dateDue: q.Select(['data', 'dateDue'], q.Var('instance')),
        group: q.Let(
          {
            instance: q.Get(
              q.Select(['data', 'group'], q.Var('instance')) // Group
            ),
          },
          {
            id: q.Select(['ref', 'id'], q.Var('instance')),
            name: q.Select(['data', 'name'], q.Var('instance')),
          }
        ),
        headers: q.Prepend(
          { text: 'Username', align: 'start', value: 'name', tip: 'Username' },
          q.Map(
            q.Select(['data', 'questions'], q.Var('instance')),
            q.Lambda(
              'ref',
              q.Let(
                {
                  instance: q.Get(
                    q.Ref(q.Collection('Question'), q.Var('ref'))
                  ), // Question
                },
                {
                  value: q.ToString(q.Var('ref')),
                  text: q.Select(['data', 'text'], q.Var('instance')),
                  maxMark: q.Select(['data', 'maxMark'], q.Var('instance')),
                  guidance: q.Select(['data', 'guidance'], q.Var('instance')),
                  markScheme: q.Map(
                    q.Select(
                      'data',
                      q.Paginate(
                        q.Match(
                          q.Index('marks_for_question_3'),
                          q.Select('ref', q.Var('instance'))
                        )
                      )
                    ),
                    // marks_for_question_3 returns an array:
                    // [data.order, ts, data.text, Mark ref]
                    q.Lambda(
                      'mArr',
                      q.Let(
                        // Turn array into proper object
                        {
                          obj: q.Var('mArr'),
                        },
                        {
                          order: q.Select([0], q.Var('obj')),
                          text: q.Select([2], q.Var('obj')),
                          id: q.Select('id', q.Select([3], q.Var('obj'))),
                        }
                      )
                    )
                  ),
                }
              )
            )
          )
        ),
        // Get the students for this assignment
        students: q.Select(
          'data',
          q.Map(
            q.Paginate(
              q.Match(
                q.Index('assignment_students'),
                q.Select('ref', q.Var('instance'))
              )
            ),
            q.Lambda(
              'sRef',
              q.Let(
                {
                  instancex: q.Get(q.Var('sRef')), // User (student)
                  // Pull in assignment from outer scope
                  assignment: q.Var('instance'),
                },
                // New data structure for each student
                // *single responses for questions only*
                {
                  name: q.Select(['data', 'username'], q.Var('instancex')),
                  responses: q.Map(
                    q.Union(
                      q.Map(
                        q.Select(['data', 'questions'], q.Var('instance')),
                        q.Lambda(
                          'ref',
                          q.Select(
                            'data',
                            // Some old questions have multiple
                            q.Take(
                              1,
                              q.Paginate(
                                q.Match(
                                  q.Index(
                                    'responses_by_student_question_assignment'
                                  ),
                                  q.Select('ref', q.Var('instancex')), // Student
                                  q.Ref(q.Collection('Question'), q.Var('ref')), // Question
                                  q.Select('ref', q.Var('assignment')) // Assignment
                                )
                              )
                            )
                          )
                        )
                      )
                    ),
                    q.Lambda(
                      'ref',
                      q.Let(
                        {
                          instance: q.Get(q.Var('ref')), // Response
                          // Pull in student from outer scope to get username
                          student: q.Var('instancex'),
                        },
                        {
                          id: q.Select(['ref', 'id'], q.Var('instance')),
                          // TODO Can _report get this from outer key?
                          username: q.Select(
                            ['data', 'username'],
                            q.Var('student')
                          ),
                          text: q.Select(['data', 'text'], q.Var('instance')),
                          time: q.Select(
                            ['data', 'timeTaken'],
                            q.Var('instance'),
                            0 // Old responses don't have timeTaken
                          ),
                          feedback: q.Select(
                            ['data', 'feedback'],
                            q.Var('instance')
                          ),
                          marked: q.Select(
                            ['data', 'marked'],
                            q.Var('instance')
                          ),
                          flagged: q.Select(
                            ['data', 'flagged'],
                            q.Var('instance')
                          ),
                          sm: q.Call(
                            q.Function('StudentMarkIds'),
                            q.Select('ref', q.Var('instance'))
                          ),
                          tm: q.Call(
                            q.Function('TeacherMarkIds'),
                            q.Select('ref', q.Var('instance'))
                          ),
                        }
                      )
                    )
                  ),
                }
              )
            )
          )
        ),
      }
    )
    const data = await keyedClient.query(qry)
    data.students.sort(compare)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}

// Sort by username (can't sort on assignment_students
// index because it doesn't contain the username)
function compare(a, b) {
  if (a.name < b.name) {
    return -1
  } else if (a.name > b.name) {
    return 1
  } else {
    return 0
  }
}
