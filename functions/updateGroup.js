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
    const qry = q.Do(
      q.Update(q.Ref(q.Collection('Group'), groupId), {
        data: {
          name: groupName,
          course: q.Ref(q.Collection('Course'), courseId),
        },
      }),
      // We need course info back to update
      // the local copy of the group object
      q.Let(
        {
          instance: q.Get(q.Ref(q.Collection('Course'), courseId)),
        },
        {
          id: q.Select(['ref', 'id'], q.Var('instance')),
          name: q.Select(['data', 'name'], q.Var('instance')),
          board: q.Select(['data', 'board'], q.Var('instance')),
          qan: q.Select(['data', 'qan'], q.Var('instance')),
          rag: q.Select(['data', 'rag'], q.Var('instance')),
        }
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
