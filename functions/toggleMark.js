const faunadb = require('faunadb')
const q = faunadb.query

// *Teacher marking only*
exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const responseId = data.responseId
  const markId = data.markId
  const add = data.add
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.If(
      q.Equals(add, true),
      // Add mark
      q.Create(q.Collection('TeacherMark'), {
        data: {
          response: q.Ref(q.Collection('Response'), responseId),
          mark: q.Ref(q.Collection('Mark'), markId),
        },
      }),
      // Remove mark
      q.Delete(
        q.Select(
          ['ref'],
          q.Get(
            q.Match(
              q.Index('delete_teacher_mark'),
              q.Ref(q.Collection('Mark'), markId),
              q.Ref(q.Collection('Response'), responseId)
            )
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
