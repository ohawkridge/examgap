const faunadb = require('faunadb')
const q = faunadb.query

// *Teacher marking only*
exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const responseId = data.responseId
  const secret = data.secret
  const marks = data.markIds
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Let(
      {
        existing: q.Select(
          'data',
          q.Map(
            q.Paginate(
              q.Match(
                q.Index('teacher_marks_by_response'),
                q.Ref(q.Collection('Response'), responseId)
              )
            ),
            q.Lambda('ref', q.Select('id', q.Var('ref')))
          )
        ),
      },
      {
        add: q.Difference(marks, q.Var('existing')),
        remove: q.Difference(q.Var('existing'), marks),
      }
    )
    const data = await keyedClient.query(qry)

    const qry2 = q.Do(
      // Remove unneeded map docs
      q.Map(
        data.remove,
        q.Lambda(
          'id',
          q.Delete(
            q.Select(
              'ref',
              q.Get(
                q.Match(
                  q.Index('delete_teacher_mark'),
                  q.Ref(q.Collection('Mark'), q.Var('id')),
                  q.Ref(q.Collection('Response'), responseId)
                )
              )
            )
          )
        )
      ),
      // Create new TeacherMarks
      q.Map(
        data.add,
        q.Lambda(
          'id',
          q.Create(q.Collection('TeacherMark'), {
            data: {
              mark: q.Ref(q.Collection('Mark'), q.Var('id')),
              response: q.Ref(q.Collection('Response'), responseId),
            },
          })
        )
      )
    )
    await keyedClient.query(qry2)
    return {
      statusCode: 200,
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
