const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const groupId = data.groupId
  const courseId = data.courseId
  const groupName = data.groupName
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Update(q.Ref(q.Collection('Group'), groupId), {
      data: {
        name: groupName,
        course: q.Ref(q.Collection('Course'), courseId),
      },
    })
    const data = await keyedClient.query(qry)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
