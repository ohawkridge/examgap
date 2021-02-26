const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const studentId = data.studentId
  const groupId = data.groupId
  const addStudent = data.addStudent
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    // Create mapping in GroupStudent
    const qry = q.If(
      addStudent,
      q.Create(q.Collection('GroupStudent'), {
        data: {
          student: q.Ref(q.Collection('User'), studentId),
          group: q.Ref(q.Collection('Group'), groupId),
        },
      }),
      // Remove mapping
      q.Delete(
        q.Select(
          ['ref'],
          q.Get(
            q.Match(
              q.Index('remove_student'),
              q.Ref(q.Collection('User'), studentId),
              q.Ref(q.Collection('Group'), groupId)
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
