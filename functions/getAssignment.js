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
        id: q.Select(['ref', 'id'], q.Var('instance')),
        name: q.Select(['data', 'name'], q.Var('instance')),
        start: q.Select(['data', 'start'], q.Var('instance'), 'N/A'),
        dateDue: q.Select(['data', 'dateDue'], q.Var('instance')),
        questions: q.Map(
          q.Select(['data', 'questions'], q.Var('instance'), []),
          q.Lambda(
            'qId',
            q.Let(
              {
                instance: q.Get(q.Ref(q.Collection('Question'), q.Var('qId'))), // Question
              },
              {
                id: q.Var('qId'),
                text: q.Select(['data', 'text'], q.Var('instance')),
                maxMark: q.Select(['data', 'maxMark'], q.Var('instance')),
                // Get the student's responses for answered questions
                // If they repeated questions, they could have >1 response
                responses: q.Select(
                  ['data'],
                  q.Map(
                    q.Paginate(
                      q.Match(
                        q.Index('question_responses'),
                        q.CurrentIdentity(), // Student
                        q.Select(['ref'], q.Var('instance')), // Question
                        q.Ref(q.Collection('Assignment'), assignmentId) // Assignment
                      )
                    ),
                    q.Lambda(
                      'rRef',
                      q.Let(
                        {
                          instance: q.Get(q.Var('rRef')), // Response
                        },
                        {
                          id: q.Select(['id'], q.Var('rRef')),
                          text: q.Select(['data', 'text'], q.Var('instance')),
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
                          tm: q.Count(
                            q.Match(
                              q.Index('teacher_marks_by_response'),
                              q.Var('rRef')
                            )
                          ),
                          sm: q.Count(
                            q.Match(
                              q.Index('self_marks_by_response'),
                              q.Var('rRef')
                            )
                          ),
                        }
                      )
                    )
                  )
                ),
              }
            )
          )
        ),
      }
    )
    const data = await keyedClient.query(qry)
    console.log(data)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
