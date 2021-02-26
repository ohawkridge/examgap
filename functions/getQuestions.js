const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const topicId = data.topicId
  const groupId = data.groupId
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Select(
      ['data'],
      q.Map(
        q.Paginate(
          q.Match(
            q.Index('topic_questions'),
            q.Ref(q.Collection('Topic'), topicId)
          )
        ),
        q.Lambda(
          'qRef',
          q.Let(
            {
              instance: q.Get(q.Var('qRef')), // Question
            },
            {
              id: q.Select(['ref', 'id'], q.Var('instance')),
              text: q.Select(['data', 'text'], q.Var('instance')),
              maxMark: q.Select(['data', 'maxMark'], q.Var('instance')),
              // Has this group been assigned this question previously?
              // Filter the group's assignments where the count of questions
              // filtered on the current question id is greater than 0
              previous: q.Map(
                q.Filter(
                  q.Select(
                    'data',
                    q.Paginate(
                      q.Match(
                        q.Index('group_assignments'),
                        q.Ref(q.Collection('Group'), groupId)
                      )
                    )
                  ),
                  q.Lambda(
                    'ass',
                    q.GT(
                      q.Count(
                        q.Filter(
                          q.Select(['data', 'questions'], q.Get(q.Var('ass'))),
                          q.Lambda(
                            'qId',
                            q.Equals(
                              q.Var('qId'),
                              q.Select(['ref', 'id'], q.Var('instance'))
                            )
                          )
                        )
                      ),
                      0
                    )
                  )
                ),
                // Get needed info for filtered assignments
                q.Lambda(
                  'ref',
                  q.Let(
                    {
                      instance: q.Get(q.Var('ref')), // Assignment
                    },
                    {
                      name: q.Select(['data', 'name'], q.Var('instance')),
                      date: q.Select(['data', 'dateDue'], q.Var('instance')),
                    }
                  )
                )
              ),
            }
          )
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
