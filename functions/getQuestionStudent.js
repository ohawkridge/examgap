const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const questionId = data.questionId
  const secret = data.secret
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Let(
      {
        instance: q.Get(q.Ref(q.Collection('Question'), questionId)), // Question
      },
      {
        id: q.Select(['ref', 'id'], q.Var('instance')),
        text: q.Select(['data', 'text'], q.Var('instance')),
        maxMark: q.Select(['data', 'maxMark'], q.Var('instance')),
        keywords: q.Select(['data', 'keywords'], q.Var('instance')),
        minWords: q.Select(['data', 'minWords'], q.Var('instance')),
        guidance: q.Select(['data', 'guidance'], q.Var('instance')),
        marks: q.Select(
          ['data'],
          q.Map(
            q.Paginate(
              q.Match(
                q.Index('marks_for_question_3'),
                q.Ref(q.Collection('Question'), questionId)
              )
            ),
            q.Lambda(
              'mRef',
              q.Let(
                {
                  // marks_for_question_3 sorts on order (if it exists) then ts
                  // this index returns array of [order, ts, text, ref]
                  instance: q.Get(q.Select([3], q.Var('mRef'))), // Mark
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
    )
    const data = await keyedClient.query(qry)
    console.log(data)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
