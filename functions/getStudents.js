const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const groupId = data.groupId
  const namesOnly = data.namesOnly
  const secret = data.secret
  console.log(`data for group`, groupId)
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
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
                    // Get all responses by this student in this group
                    // (Whole doc so we can filter revision later)
                    responses: q.Select(
                      'data',
                      q.Map(
                        q.Paginate(
                          q.Match(
                            q.Index('student_responses_by_group'),
                            q.Select('ref', q.Var('instance')), // Student
                            q.Ref(q.Collection('Group'), groupId) // Group
                          ),
                          { size: 999 }
                        ),
                        q.Lambda('rRef', q.Get(q.Var('rRef')))
                      )
                    ),
                    rev_count: q.Count(
                      q.Filter(
                        q.Var('responses'),
                        q.Lambda(
                          'res',
                          // Independent revision has no assignment
                          q.Equals(
                            q.Select(['data', 'assignment'], q.Var('res')),
                            ''
                          )
                        )
                      )
                    ),
                    // Need later as average is calculated
                    // based on marked responses only
                    markedResponses: q.Filter(
                      q.Var('responses'),
                      q.Lambda(
                        'res',
                        q.Equals(
                          q.Select(['data', 'marked'], q.Var('res')),
                          true
                        )
                      )
                    ),
                  },
                  {
                    assignment: q.Select(
                      ['data', 0],
                      q.Sum(
                        q.Map(
                          q.Paginate(
                            q.Match(
                              q.Index('group_assignments'),
                              q.Ref(q.Collection('Group'), groupId)
                            ),
                            { size: 999 }
                          ),
                          q.Lambda(
                            'ref',
                            q.Count(
                              q.Select(
                                ['data', 'questions'],
                                q.Get(q.Var('ref'))
                              )
                            )
                          )
                        )
                      )
                    ),
                    completed: q.Subtract(
                      q.Count(q.Var('responses')),
                      q.Var('rev_count')
                    ),
                    revision: q.Var('rev_count'),
                    average: q.If(
                      // If no questions have been marked, you'll be
                      // dividing by 0 when you calculate average
                      q.Equals(q.Count(q.Var('markedResponses')), 0),
                      '-',
                      q.Round(
                        q.Multiply(
                          q.Divide(
                            // Total marks awarded over all questions WORKS
                            q.Sum(
                              q.Map(
                                q.Var('markedResponses'),
                                q.Lambda(
                                  'res',
                                  q.Call(
                                    q.Function('TeacherMarks'),
                                    q.Var('res')
                                  )
                                )
                              )
                            ),
                            // Total marks possible
                            q.ToDouble(
                              q.Sum(
                                q.Map(
                                  q.Var('markedResponses'),
                                  q.Lambda(
                                    'res',
                                    q.ToInteger(
                                      q.Select(
                                        ['data', 'maxMark'],
                                        q.Get(
                                          q.Select(
                                            ['data', 'question'],
                                            q.Var('res')
                                          )
                                        )
                                      )
                                    )
                                  )
                                )
                              )
                            )
                          ),
                          100
                        ),
                        0
                      )
                    ),
                    time: q.Let(
                      {
                        seconds: q.Sum(
                          q.Map(
                            q.Var('responses'),
                            q.Lambda(
                              'doc',
                              q.Select(['data', 'timeTaken'], q.Var('doc'), 0)
                            )
                          )
                        ),
                      },
                      {
                        formatted: q.Concat(
                          [
                            q.ToString(q.Floor(q.Divide(q.Var('seconds'), 60))),
                            q.If(
                              q.LT(q.Modulo(q.Var('seconds'), 60), 10),
                              q.Concat([
                                '0',
                                q.ToString(q.Modulo(q.Var('seconds'), 60)),
                              ]),
                              q.ToString(q.Modulo(q.Var('seconds'), 60))
                            ),
                          ],
                          ':'
                        ),
                      }
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
