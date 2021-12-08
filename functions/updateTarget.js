const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const target = data.target
  const groupId = data.groupId
  const studentId = data.studentId
  console.log(target)
  console.log(groupId)
  console.log(studentId)
  const secret = data.secret
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Update(q.Ref(q.Collection('User'), studentId), {
      data: {
        target: {
          [groupId]: target,
        },
      },
    })
    const data = await keyedClient.query(qry)
    // console.log(data)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
