const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const groupId = data.groupId
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Let(
      {
        instance: q.Get(q.Ref(q.Collection('Group'), groupId)), // Group
      },
      {
        headers: q.Prepend(
          [
            { text: 'Username', value: 'username', align: 'start' },
            { text: 'Target', value: 'target', align: 'center' },
          ],
          q.Select(
            'data',
            q.Map(
              q.Paginate(
                q.Match(
                  q.Index('group_assignments_gradebook'),
                  q.Select('ref', q.Var('instance'))
                )
              ),
              q.Lambda(
                'aRef',
                q.Let(
                  {
                    instance: q.Get(q.Var('aRef')), // Assignment
                    assMax: q.Sum(
                      q.Map(
                        q.Select(['data', 'questions'], q.Var('instance')),
                        q.Lambda(
                          'qId',
                          q.ToInteger(
                            q.Select(
                              ['data', 'maxMark'],
                              q.Get(
                                q.Ref(q.Collection('Question'), q.Var('qId'))
                              )
                            )
                          )
                        )
                      )
                    ),
                  },
                  {
                    // Add assignment total mark after name
                    // E.g., Algorithms questions [12]
                    text: q.Concat([
                      q.Select(['data', 'name'], q.Var('instance')),
                      ' [',
                      q.ToString(q.Var('assMax')),
                      ']',
                    ]),
                    value: q.Select(['ref', 'id'], q.Var('instance')),
                    align: 'center',
                    max: q.Var('assMax'),
                  }
                )
              )
            )
          )
        ),
        data: q.Select(
          ['data'],
          q.Map(
            q.Paginate(
              q.Match(
                q.Index('group_students'),
                q.Select('ref', q.Var('instance'))
              )
            ),
            q.Lambda(
              'stuRef',
              q.Merge(
                {
                  // This is a bit of a hack. Marge takes an object and an array of
                  // objects. Adding a second top-level key for target messes up
                  // _grades.vue. So does adding it to the 2D array below.
                  username: q.Select(
                    ['data', 'username'],
                    q.Get(q.Var('stuRef'))
                  ),
                  target: q.Select(
                    ['data', 'target', groupId],
                    q.Get(q.Var('stuRef')),
                    '-'
                  ),
                },
                // Below must retrun an array of objects where the key is the
                // assignment ID and the value is the student's score
                q.Select(
                  ['data'],
                  q.Map(
                    q.Paginate(
                      q.Match(
                        q.Index('group_assignments_gradebook'),
                        q.Ref(q.Collection('Group'), groupId)
                      )
                    ),
                    q.Lambda(
                      'aRef',
                      q.ToObject([
                        [
                          q.Select(['id'], q.Var('aRef')), // Assignment
                          // If statement uses student_for_assignment index to
                          // determine if the student was part of the assignment
                          q.If(
                            // Zero entries in AssignmentStudent means
                            // student wasn't part of this assignment
                            q.Or(
                              q.Equals(
                                q.Count(
                                  q.Match(
                                    q.Index('student_for_assignment'),
                                    q.Var('stuRef'),
                                    q.Var('aRef')
                                  )
                                ),
                                0
                              ),
                              // Student has zero responses for this assignment
                              // so show 'n/a' in grade book rather than 0
                              q.Equals(
                                q.Count(
                                  q.Match(
                                    q.Index('student_assignment_responses'),
                                    q.Var('aRef'),
                                    q.Var('stuRef')
                                  )
                                ),
                                0
                              )
                            ),
                            'N/A', // Student not part of assignment (n/a = not assigned)
                            // Total teacher marks for this assignment
                            // Map over the assignment's questions Array
                            // For each question get this student's responses
                            // and for each of those the sum of TeacherMarks
                            // By here you have a 2D array like [[2], [4], [1]]
                            // Where each sub-array is the count of teacher
                            // marks for this question's responses
                            q.Sum(
                              q.Map(
                                // The assignment's array of questions
                                q.Select(
                                  ['data', 'questions'],
                                  q.Get(q.Var('aRef'))
                                ),
                                q.Lambda(
                                  'qId',
                                  // Map count of teacher marks across responses
                                  q.Select(
                                    ['data', 0], // Select count only out of data object
                                    q.Sum(
                                      q.Map(
                                        q.Paginate(
                                          q.Match(
                                            // Student's responses for this question
                                            q.Index('question_responses'),
                                            q.Var('stuRef'), // Student
                                            q.Ref(
                                              q.Collection('Question'),
                                              q.Var('qId')
                                            ), // Question
                                            q.Var('aRef') // Assignment
                                          )
                                        ),
                                        q.Lambda(
                                          'rRef',
                                          q.Count(
                                            q.Match(
                                              q.Index(
                                                'teacher_marks_by_response'
                                              ),
                                              q.Var('rRef')
                                            )
                                          )
                                        )
                                      )
                                    )
                                  )
                                )
                              )
                            )
                          ),
                        ],
                      ])
                    )
                  )
                )
              )
            )
          )
        ),
      }
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
