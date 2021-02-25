const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const responseId = data.responseId
  const markId = data.markId
  const add = data.add
  const teacher = data.teacher
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.If(
      q.Equals(add, true),
      // Add mark
      q.Create(q.Collection(teacher ? 'TeacherMark' : 'SelfMark'), {
        data: {
          response: q.Ref(q.Collection('Response'), responseId),
          mark: q.Ref(q.Collection('Mark'), markId),
        },
      }),
      // Delete mark
      q.Delete(
        q.Select(
          ['ref'],
          q.Get(
            q.Match(
              q.Index(teacher ? 'delete_teacher_mark' : 'delete_self_mark'),
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
