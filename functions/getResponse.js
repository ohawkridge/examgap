const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const responseId = data.responseId
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Let(
      {
        instance: q.Get(q.Ref(q.Collection('Response'), responseId)), // Response
      },
      {
        text: q.Select(['data', 'text'], q.Var('instance')),
        feedback: q.Select(['data', 'feedback'], q.Var('instance')),
        assignmentId: q.Select(
          'id',
          q.Select(['data', 'assignment'], q.Var('instance'))
        ),
        assignmentName: q.Select(
          ['data', 'name'],
          q.Get(q.Select(['data', 'assignment'], q.Var('instance')))
        ),
        question: q.Let(
          {
            instance: q.Get(q.Select(['data', 'question'], q.Var('instance'))), // Question
          },
          {
            text: q.Select(['data', 'text'], q.Var('instance')),
            maxMark: q.Select(['data', 'maxMark'], q.Var('instance')),
            modelAnswer: q.Select(['data', 'modelAnswer'], q.Var('instance')),
            guidance: q.Select(['data', 'guidance'], q.Var('instance')),
            markScheme: q.Select(
              ['data'],
              q.Map(
                q.Paginate(
                  q.Match(
                    q.Index('marks_for_question_2'),
                    q.Select('ref', q.Var('instance'))
                  )
                ),
                q.Lambda(
                  'mRef',
                  q.Let(
                    {
                      // marks_for_question_2 sorts on order (if it exists)
                      // this index returns array of [order, text, ref]
                      instance: q.Get(q.Select([2], q.Var('mRef'))), // Mark
                    },
                    {
                      id: q.Select(['ref', 'id'], q.Var('instance')),
                      text: q.Select(['data', 'text'], q.Var('instance')),
                    }
                  )
                )
              )
            ),
          }
        ),
        // For tm and sm, we only need a list of IDs
        tm: q.Select(
          ['data'],
          q.Map(
            q.Paginate(
              q.Match(
                q.Index('teacher_marks_by_response'),
                q.Ref(q.Collection('Response'), responseId)
              )
            ),
            q.Lambda('mRef', q.Select(['id'], q.Var('mRef')))
          )
        ),
        sm: q.Select(
          ['data'],
          q.Map(
            q.Paginate(
              q.Match(
                q.Index('self_marks_by_response'),
                q.Ref(q.Collection('Response'), responseId)
              )
            ),
            q.Lambda('mRef', q.Select(['id'], q.Var('mRef')))
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
