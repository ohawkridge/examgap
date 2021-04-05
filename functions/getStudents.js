const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const groupId = data.groupId
  const namesOnly = data.namesOnly
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Select(
      'data',
      q.Map(
        q.Paginate(
          q.Match(
            q.Index('group_students'),
            q.Ref(q.Collection('Group'), groupId)
          )
        ),
        q.Lambda(
          'ref',
          q.Let(
            {
              instance: q.Get(q.Var('ref')),
            },
            {
              id: q.Select(['ref', 'id'], q.Var('instance')),
              username: q.Select(['data', 'username'], q.Var('instance')),
              examMode: q.Select(['data', 'examMode'], q.Var('instance')),
              // Some students won't even have "target" as a field
              // Others will, but might not have a target for this class
              target: q.If(
                q.ContainsField('target', q.Select('data', q.Var('instance'))),
                q.If(
                  // Target field, but maybe not for this class
                  q.ContainsField(
                    groupId,
                    // Target is for this class, so use it
                    q.Select(['data', 'target'], q.Var('instance'))
                  ),
                  q.Select(['data', 'target'], q.Var('instance')),
                  // Create an empty target for this group
                  q.Merge(
                    { [groupId]: '-' },
                    q.Select(['data', 'target'], q.Var('instance'))
                  )
                ),
                // No target field at all
                {
                  [groupId]: '-',
                }
              ),
              // For create assignment we don't need this
              data: q.If(
                namesOnly,
                [],
                q.Let(
                  {
                    // Get all responses for all questions by this student
                    responses: q.Paginate(
                      q.Match(
                        q.Index('student_responses_by_group'),
                        q.Select('ref', q.Var('instance')), // Student
                        q.Ref(q.Collection('Group'), groupId) // Group
                      ),
                      { size: 999 }
                    ),
                    // Count responses for *assignments*
                    ass_count: q.Select(
                      ['data', 0],
                      q.Count(
                        q.Filter(
                          q.Var('responses'),
                          q.Lambda(
                            'ref',
                            q.Not(
                              q.Equals(
                                q.Select(
                                  ['data', 'assignment'],
                                  q.Get(q.Var('ref'))
                                ),
                                '' // Empty for ndependent revision
                              )
                            )
                          )
                        )
                      )
                    ),
                  },
                  {
                    assignment: q.Var('ass_count'),
                    // Calculate responses for *revision*
                    revision: q.Subtract(
                      q.Select(['data', 0], q.Count(q.Var('responses'))),
                      q.Var('ass_count')
                    ),
                    average: q.Format(
                      '%.0f',
                      q.Multiply(
                        q.Divide(
                          // For each response, get the count of TeacherMarks
                          q.ToDouble(
                            q.Sum(
                              q.Map(
                                q.Select(
                                  ['data'],
                                  q.Filter(
                                    q.Var('responses'),
                                    q.Lambda(
                                      'ref',
                                      q.Equals(
                                        q.Select(
                                          ['data', 'marked'],
                                          q.Get(q.Var('ref'))
                                        ),
                                        true
                                      )
                                    )
                                  )
                                ),
                                q.Lambda(
                                  'ref',
                                  q.Count(
                                    q.Match(
                                      q.Index('teacher_marks_by_response'),
                                      q.Var('ref')
                                    )
                                  )
                                )
                              )
                            )
                          ),
                          // ABOVE WORKS
                          // Sum the max marks for each response's question
                          // Watch out !! If student hasn't answered any questions
                          // you'll get a DIV0 error here
                          q.If(
                            // GT Will be true if there are responses
                            q.GT(
                              q.ToInteger(
                                q.Select(
                                  ['data', 0],
                                  q.Count(
                                    q.Filter(
                                      q.Var('responses'),
                                      q.Lambda(
                                        'resp',
                                        q.Equals(
                                          q.Select(
                                            ['data', 'marked'],
                                            q.Get(q.Var('resp'))
                                          ),
                                          true
                                        )
                                      )
                                    )
                                  )
                                )
                              ),
                              0
                            ),
                            // This bit (denominator) is 0
                            // There *are* responses, but none that are marked
                            q.ToDouble(
                              q.Sum(
                                q.Map(
                                  q.Select(
                                    ['data'],
                                    q.Filter(
                                      q.Var('responses'),
                                      q.Lambda(
                                        'ref',
                                        q.Equals(
                                          q.Select(
                                            ['data', 'marked'],
                                            q.Get(q.Var('ref'))
                                          ),
                                          true
                                        )
                                      )
                                    )
                                  ),
                                  q.Lambda(
                                    'ref',
                                    q.ToInteger(
                                      q.Select(
                                        ['data', 'maxMark'],
                                        q.Get(
                                          q.Select(
                                            ['data', 'question'],
                                            q.Get(q.Var('ref'))
                                          )
                                        )
                                      )
                                    )
                                  )
                                )
                              )
                            ),
                            // There are no responses
                            0.00000001 // Avoid DIV0, but rounds down to 0
                          )
                        ),
                        100
                      )
                    ),
                  }
                )
              ),
            }
          )
        )
      )
    )
    const data = await keyedClient.query(qry)
    data.sort(compare)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}

// Sort by username descending
// N.B. Can't be done out of db as GroupStudent docs are unsorted
function compare(a, b) {
  if (a.username < b.username) {
    return -1
  } else if (a.username > b.username) {
    return 1
  } else {
    return 0
  }
}
