const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const studentIds = data.studentIds
  const groupId = data.groupId
  const secret = data.secret
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    // Create mappings in GroupStudent to 'copy' students into group
    const qry = q.Map(
      studentIds,
      q.Lambda(
        'id',
        q.Create(q.Collection('GroupStudent'), {
          data: {
            student: q.Ref(q.Collection('User'), q.Var('id')),
            group: q.Ref(q.Collection('Group'), groupId),
          },
        })
      )
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
