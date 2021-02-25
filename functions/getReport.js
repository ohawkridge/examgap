const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const assignmentId = data.assignmentId
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Let(
      {
        instance: q.Get(q.Ref(q.Collection('Assignment'), assignmentId)), // Assignment
      },
      {
        headers: q.Prepend(
          { text: 'Username', align: 'start', value: 'name', tip: 'Username' },
          q.Map(
            q.Select(['data', 'questions'], q.Var('instance')),
            q.Lambda(
              'qId',
              q.Let(
                {
                  instance: q.Get(
                    q.Ref(q.Collection('Question'), q.Var('qId'))
                  ), // A question
                },
                {
                  text: q.Select(['data', 'text'], q.Var('instance')),
                  maxMark: q.Select(['data', 'maxMark'], q.Var('instance')),
                  value: q.ToString(q.Var('qId')),
                  markScheme: q.Select(
                    ['data'],
                    q.Paginate(
                      q.Match(
                        q.Index('marks_for_question_2'),
                        q.Select('ref', q.Var('instance'))
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
                  instance: q.Get(q.Var('sRef')), // User (student)
                },
                // Data structure we need to build for each student
                // An object where each key is the question id
                // and its value is the count of self marks
                {
                  name: q.Select(['data', 'username'], q.Var('instance')),
                  // Map over assignment questions and
                  // get student's self-mark total
                  data: q.Map(
                    q.Select(
                      ['data', 'questions'],
                      q.Get(q.Ref(q.Collection('Assignment'), assignmentId))
                    ),
                    q.Lambda(
                      'qRef',
                      // Student's response*s* for question
                      q.ToObject([
                        [
                          q.Var('qRef'),
                          q.Select(
                            'data',
                            q.Map(
                              q.Paginate(
                                q.Match(
                                  q.Index(
                                    'responses_by_student_question_assignment'
                                  ),
                                  q.Select('ref', q.Var('instance')), // Student
                                  q.Ref(
                                    q.Collection('Question'),
                                    q.Var('qRef')
                                  ), // Question
                                  q.Ref(
                                    q.Collection('Assignment'),
                                    assignmentId
                                  ) // Assignment
                                )
                              ),
                              q.Lambda(
                                'rRef',
                                q.Let(
                                  {
                                    instance: q.Get(q.Var('rRef')), // Response
                                  },
                                  {
                                    id: q.Select(
                                      ['ref', 'id'],
                                      q.Var('instance')
                                    ),
                                    text: q.Select(
                                      ['data', 'text'],
                                      q.Var('instance')
                                    ),
                                    // Grab username again here so it's
                                    // visible in EgMarking interface
                                    username: q.Select(
                                      ['data', 'username'],
                                      q.Get(
                                        q.Select(
                                          ['data', 'student'],
                                          q.Var('instance')
                                        )
                                      )
                                    ),
                                    feedback: q.Select(
                                      ['data', 'feedback'],
                                      q.Var('instance')
                                    ),
                                    marked: q.Select(
                                      ['data', 'marked'],
                                      q.Var('instance')
                                    ),
                                    repeat: q.Select(
                                      ['data', 'repeat'],
                                      q.Var('instance')
                                    ),
                                    flagged: q.Select(
                                      ['data', 'flagged'],
                                      q.Var('instance')
                                    ),
                                    tm: q.Select(
                                      ['data'],
                                      q.Map(
                                        q.Paginate(
                                          q.Match(
                                            q.Index(
                                              'teacher_marks_by_response'
                                            ),
                                            q.Select(['ref'], q.Var('instance'))
                                          )
                                        ),
                                        q.Lambda(
                                          'tmRef',
                                          q.Select('id', q.Var('tmRef'))
                                        )
                                      )
                                    ),
                                    sm: q.Select(
                                      ['data'],
                                      q.Map(
                                        q.Paginate(
                                          q.Match(
                                            q.Index('self_marks_by_response'),
                                            q.Select(['ref'], q.Var('instance'))
                                          )
                                        ),
                                        q.Lambda(
                                          'smRef',
                                          q.Select('id', q.Var('smRef'))
                                        )
                                      )
                                    ),
                                  }
                                )
                              )
                            )
                          ),
                        ],
                      ])
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
    return { statusCode: 500, body: err.toString() }
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
