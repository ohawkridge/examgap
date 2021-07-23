const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const secret = data.secret
  const studentIds = data.studentIds
  const groupId = data.groupId
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Map(
      studentIds,
      q.Lambda(
        'id',
        q.Delete(
          q.Select(
            'ref',
            q.Get(
              // Find GroupStudent document for this student & group
              q.Match(
                q.Index('remove_student'),
                q.Ref(q.Collection('User'), q.Var('id')),
                q.Ref(q.Collection('Group'), groupId)
              )
            )
          )
        )
      )
    )
    await keyedClient.query(qry)
    return {
      statusCode: 200,
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
